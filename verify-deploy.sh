#!/bin/bash

echo "✅ Verifying Spring Boot config..."
grep -q "server.port=\${PORT:8080}" src/main/resources/application.properties && echo "✅ server.port is set correctly" || echo "❌ Missing or incorrect server.port config"
grep -q "server.address=0.0.0.0" src/main/resources/application.properties && echo "✅ server.address is set correctly" || echo "❌ Missing or incorrect server.address config"

echo "✅ Checking HealthController..."
grep -rq "@GetMapping(\"/health\")" src/main/java && echo "✅ Health endpoint exists" || echo "❌ Missing health endpoint"

echo "✅ Checking .gitignore for target/ and *.jar..."
grep -q "target/" .gitignore && echo "✅ target/ is ignored" || echo "❌ target/ not ignored"
grep -q "*.jar" .gitignore && echo "✅ *.jar is ignored" || echo "❌ *.jar not ignored"

echo "✅ Done. Ready to push and deploy? 🎯"

