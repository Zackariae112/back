#!/bin/bash
echo "🔧 Starting app + curl test..."
java -jar app.jar &
APP_PID=$!
sleep 30
echo "🔍 Curling /health"
curl -v http://localhost:8080/health || echo "❌ /health failed"
wait $APP_PID

