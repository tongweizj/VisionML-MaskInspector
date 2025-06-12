const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = function(db) {
    const router = express.Router();
    // 正确设置基础路径
    // 动态获取项目根目录（兼容不同运行环境）
    const getProjectRoot = () => {
      // 方法1：通过__dirname追溯（适用于文件在项目子目录）
      const dirFromDb = path.resolve(__dirname, './..'); // 假设db.js在项目根目录
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
    
    const rawPath = path.join(projectRoot, 'public/images/originals');
    const maskPath = path.join(projectRoot, 'public/images/masks');
    // 验证路径
    if (!fs.existsSync(rawPath)) {
        console.error(`错误: 原始图片目录不存在 (${rawPath})`);
        process.exit(1);
    }
    // 首页 - 显示图片
    router.get('/', (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 100;
        const offset = (page - 1) * limit;
        
        // 获取统计数据
        db.all(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN isRight = 1 THEN 1 ELSE 0 END) as correct,
                SUM(CASE WHEN isRight = 0 THEN 1 ELSE 0 END) as incorrect
            FROM annotations
        `, [], (err, stats) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // 获取当前页的图片
            db.all(`
                SELECT * FROM annotations 
                ORDER BY filename 
                LIMIT ? OFFSET ?
            `, [limit, offset], (err, images) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                
                // 检查图片是否存在
                // const rawPath = path.join(__dirname, '../public/images/originals');
                // const maskPath = path.join(__dirname, '../public/images/masks');
                
                const processedImages = images.map(img => {
                    const rawExists = fs.existsSync(path.join(rawPath, img.filename));
                    const maskBase = path.join(maskPath, img.filename.replace(/\.[^/.]+$/, ""));
                    
                    // 检查4个mask图片是否存在
                    const masksExist = [
                        fs.existsSync(`${maskBase}/kp_01.png`),
                        fs.existsSync(`${maskBase}/kp_02.png`),
                        fs.existsSync(`${maskBase}/kp_21.png`),
                        fs.existsSync(`${maskBase}/kp_03.png`)
                    ];
                    
                    return {
                        ...img,
                        rawExists,
                        masksExist,
                        allMasksExist: masksExist.every(exists => exists)
                    };
                });
                
                res.render('index', {
                    title: '图片标注检查工具',
                    stats: stats[0],
                    images: processedImages,
                    currentPage: page,
                    totalPages: Math.ceil(stats[0].total / limit)
                });
            });
        });
    });
    
    // 更新标注状态
    router.post('/update', (req, res) => {
        const { filename, status } = req.body;
        const anchor = req.query._anchor || '';
        const page = req.query._page || 1; // 获取当前页码
        
        if (!filename || !['correct', 'incorrect'].includes(status)) {
            return res.status(400).send('Invalid request');
        }
        
        db.run(`
            UPDATE annotations 
            SET isRight = ?, lastUpdated = datetime('now')
            WHERE filename = ?
        `, [status === 'correct' ? 1 : 0, filename], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            
            // res.redirect(`/?page=${page}`); // ✅ 跳转回当前页
            res.redirect(`/?page=${page}#${anchor}`);
        });
    });
    
    return router;
};