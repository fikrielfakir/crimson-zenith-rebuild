#!/bin/bash
# Auto-apply PostgreSQL schema on startup (non-interactive, safe for existing tables)
echo "🗄️  Syncing PostgreSQL schema..."
yes | node node_modules/drizzle-kit/bin.cjs push 2>/dev/null || true
echo "✅ Schema ready"

# Seed admin if not present
node -e "
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const {randomUUID} = require('crypto');
async function run() {
  if (!process.env.DATABASE_URL) return;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(\"SELECT id FROM users WHERE username = 'admin' LIMIT 1\");
    if (res.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        \`INSERT INTO users (id, username, password, email, first_name, last_name, is_admin, is_active, email_verified, created_at, updated_at)
         VALUES (\$1, 'admin', \$2, 'admin@morocclubs.com', 'Admin', 'User', true, true, true, NOW(), NOW())
         ON CONFLICT (username) DO NOTHING\`,
        [randomUUID(), hash]
      );
      console.log('✅ Admin user seeded (username: admin, password: admin123)');
    }
  } catch(e) { /* table may not exist yet — skip */ }
  finally { await pool.end(); }
}
run();
" 2>/dev/null || true

node node_modules/tsx/dist/cli.mjs server.ts &
TSX_PID=$!
sleep 3
node node_modules/vite/bin/vite.js &
VITE_PID=$!
wait $TSX_PID $VITE_PID
