# README

### 项目描述
基于Express的机器学习数据集标注检查工具

### 核心功能
- **双图对比显示**：
  - 原始图片 + 4个对应mask（`kp_01.png`, `kp_02.png`, `kp_21.png`, `kp_03.png`）
  - 固定224×224像素显示（非等比拉伸）

- **标注数据库**：
  ```sql
  CREATE TABLE annotations (
    filename TEXT PRIMARY KEY,
    isRight INTEGER,  -- NULL:未检查, 1:正确, 0:错误
    isMask BOOLEAN DEFAULT TRUE,
    lastUpdated TIMESTAMP
  );
  ```

- **高效审核**：
  - 每页显示100套图片
  - 一键质量标注（[正确]/[错误]按钮）
  - 实时统计面板

### 快速开始
1. **目录准备**：
   ```bash
   mkdir -p public/images/{originals,masks}
   ```

2. **安装运行**：
   ```bash
   npm install
   npm start
   ```

3. **文件规范**：
   ```
   public/images/
   ├── originals/            # 原始图片
   │   └── image1.jpg
   └── masks/                # Mask目录
       └── image1/           # 注意：不含扩展名
           ├── kp_01.png
           ├── kp_02.png
           ├── kp_21.png
           └── kp_03.png
   ```

### 界面说明
![Screenshot](https://raw.githubusercontent.com/tongweizj/VisionML-MaskInspector/refs/heads/main/doc/web-page-screenshot.png)
1. 顶部统计栏：总图片数/正确数/错误数
2. 单套图片显示：
   - 标题区：文件名 + 状态标签
   - 图片区：原始图 + 4张mask叠加图
   - 操作区：右侧功能按钮

### 开发建议
```javascript
// 图片叠加CSS建议
.mask-container {
  position: relative;
  width: 224px;
  height: 224px;
}
.mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  mix-blend-mode: multiply;
}
```