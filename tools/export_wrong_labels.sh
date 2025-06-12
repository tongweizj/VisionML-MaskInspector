#!/bin/bash
DB_PATH="$1"
OUTPUT_FILE="${2:-/dev/stdout}"

sqlite3 "$DB_PATH" <<EOF > "$OUTPUT_FILE"
.mode list
SELECT filename FROM annotations WHERE isRight = 0;
EOF

echo "导出完成，结果已保存到 $OUTPUT_FILE" >&2

# Use Guaid
# chmod +x export_wrong_labels.sh
# ./export_wrong_labels.sh ../database/annotations.db wrong_images.txt