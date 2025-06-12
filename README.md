# VisionML-MaskInspector / 视觉ML-标注检查器

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Screenshot](https://raw.githubusercontent.com/tongweizj/VisionML-MaskInspector/refs/heads/main/doc/web-page-screenshot.png)

## Project Description
An Express-based web tool for validating image annotations in machine learning datasets.

## Key Features
- **Dual-image Display**: 
  - Raw images + 4 corresponding masks (`kp_01.png`, `kp_02.png`, `kp_21.png`, `kp_03.png`)
  - Fixed 224×224px display with non-proportional stretching

- **Annotation Database**:
  ```sql
  CREATE TABLE annotations (
    filename TEXT PRIMARY KEY,
    isRight INTEGER,  -- NULL:unchecked, 1:correct, 0:incorrect
    isMask BOOLEAN DEFAULT TRUE,
    lastUpdated TIMESTAMP
  );
  ```

- **Efficient Review**:
  - 100 image sets per page
  - One-click quality tagging ([Correct]/[Incorrect] buttons)
  - Real-time statistics dashboard

## Quick Start
1. **Directory Setup**:
   ```bash
   mkdir -p public/images/{originals,masks}
   ```

2. **Install & Run**:
   ```bash
   npm install
   npm start
   ```

3. **File Structure**:
   ```
   public/images/
   ├── originals/            # Raw images
   │   └── image1.jpg
   └── masks/                # Mask directories
       └── image1/           # Note: no extension
           ├── kp_01.png
           ├── kp_02.png
           ├── kp_21.png
           └── kp_03.png
   ```

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main review interface |
| `/update` | POST | Update annotation status |

## Resource

- [README中文版]()