#!/bin/bash
# إعداد المهمة اليومية التلقائية لإضافة 20 فيلم
# يعمل كل يوم الساعة 3:00 صباحاً

SCRIPT_PATH="/Users/mac/cinereview/scripts/auto-add-movies.mjs"
LOG_PATH="/Users/mac/cinereview/scripts/cron.log"
CRON_CMD="0 3 * * * /usr/local/bin/node $SCRIPT_PATH >> $LOG_PATH 2>&1"

# Check node path
NODE_PATH=$(which node)
echo "Node.js: $NODE_PATH"

# Create log file
touch "$LOG_PATH"

# Add to crontab
(crontab -l 2>/dev/null | grep -v "auto-add-movies"; echo "0 3 * * * $NODE_PATH $SCRIPT_PATH >> $LOG_PATH 2>&1") | crontab -

echo ""
echo "✅ تم إعداد المهمة التلقائية!"
echo "⏰ يعمل كل يوم الساعة 3:00 صباحاً"
echo "📄 السجل: $LOG_PATH"
echo ""
echo "للتحقق من الجدول:"
echo "  crontab -l"
echo ""
echo "لتشغيل يدوي الآن:"
echo "  node $SCRIPT_PATH"
echo ""
echo "لإيقاف المهمة:"
echo "  crontab -l | grep -v auto-add-movies | crontab -"
