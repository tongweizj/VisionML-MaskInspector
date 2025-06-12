import os
import shutil
from collections import defaultdict

# 目录路径
IMAGE_DIR = "images/originals"
MASK_DIR = "images/masks"
OUTPUT_IMAGE_DIR = "images/duplicates/originals"
OUTPUT_MASK_DIR = "images/duplicates/masks"

# 创建目标目录
os.makedirs(OUTPUT_IMAGE_DIR, exist_ok=True)
os.makedirs(OUTPUT_MASK_DIR, exist_ok=True)

# 记录文件名（不含扩展名）出现次数
name_map = defaultdict(list)

for filename in os.listdir(IMAGE_DIR):
    filepath = os.path.join(IMAGE_DIR, filename)
    if not os.path.isfile(filepath):
        continue
    name, ext = os.path.splitext(filename)
    name_map[name].append(filename)

# 找出重名图片
duplicates = {name: files for name, files in name_map.items() if len(files) > 1}

for name, file_list in duplicates.items():
    # 复制所有重复的图片
    for file in file_list:
        src_img_path = os.path.join(IMAGE_DIR, file)
        dst_img_path = os.path.join(OUTPUT_IMAGE_DIR, file)
        shutil.copy2(src_img_path, dst_img_path)
        print(f"✅ Copied image: {file}")

    # 复制对应的 mask 文件夹（整个目录）
    src_mask_dir = os.path.join(MASK_DIR, name)
    dst_mask_dir = os.path.join(OUTPUT_MASK_DIR, name)
    if os.path.isdir(src_mask_dir):
        shutil.copytree(src_mask_dir, dst_mask_dir, dirs_exist_ok=True)
        print(f"✅ Copied mask folder: {name}")
    else:
        print(f"⚠️ No mask folder found for: {name}")

print("🎉 完成！重名图片及其 mask 文件夹已复制。")
