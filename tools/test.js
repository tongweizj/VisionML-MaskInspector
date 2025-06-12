const path = require('path');
const fs = require('fs');

// 动态获取项目根目录（兼容不同运行环境）
const getProjectRoot = () => {
  // 方法1：通过__dirname追溯（适用于文件在项目子目录）
  const dirFromDb = path.resolve(__dirname, './..'); // 假设db.js在项目根目录
  console.log("dirFromDb: ",dirFromDb)
  // 方法2：通过process.cwd()获取（适用于从项目根目录启动）
  const dirFromCwd = process.cwd();
  console.log("dirFromCwd: ",dirFromCwd)
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
console.log("projectRoot: ",projectRoot)