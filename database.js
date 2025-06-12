const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
// 确保数据库目录存在
// 动态获取项目根目录（兼容不同运行环境）
const getProjectRoot = () => {
  // 方法1：通过__dirname追溯（适用于文件在项目子目录）
  const dirFromDb = path.resolve(__dirname, '../..'); // 假设db.js在项目根目录
  
  // 方法2：通过process.cwd()获取（适用于从项目根目录启动）
  const dirFromCwd = process.cwd();
  
  // 验证哪个路径包含package.json（确保是项目根）
  const validateRoot = (dir) => {
    try {
      fs.accessSync(path.join(dir, 'package.json'), fs.constants.R_OK);
      return dir;
    } catch {
      return null;
    }
  };
  
  return validateRoot(dirFromDb) || validateRoot(dirFromCwd);
};

const projectRoot = getProjectRoot();

const dbDir = path.join(projectRoot, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'dataset.db');

const rawPath = path.join(projectRoot, 'public/images/originals');
const maskPath = path.join(projectRoot, 'public/images/masks');

// 初始化数据库
function initializeDatabase() {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Error opening database:', err);
            throw err;
        }
    });
    
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS annotations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT UNIQUE,
                isRight INTEGER,  -- NULL:未标注, 1:正确, 0:错误
                isMask INTEGER DEFAULT 1,  -- 1:没有错误, 0:存在错误
                lastUpdated TEXT
            )
        `);
        
        // 扫描原始图片目录并更新数据库
        fs.readdir(rawPath, (err, files) => {
            if (err) {
                console.error('Error reading raw images directory:', err);
                return;
            }
            
            // 过滤出图片文件
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
            );
            
            // 插入或忽略已存在的记录
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO annotations (filename, lastUpdated) 
                VALUES (?, datetime('now'))
            `);
            
            imageFiles.forEach(file => {
                stmt.run(file);
            });
            
            stmt.finalize();
        });
    });
    
    return db;
}

module.exports = initializeDatabase;