const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const initializeDatabase = require('./database');
const maskRouter = require('./routes/mask.router');

const app = express();

const db = initializeDatabase();
db.on('error', (err) => {
    console.error('Database error:', err);
    // 可以考虑在这里退出应用或尝试重新连接
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (err.code === 'SQLITE_CANTOPEN') {
        console.error('请检查数据库目录权限和路径');
    }
});
// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/', maskRouter(db));

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});