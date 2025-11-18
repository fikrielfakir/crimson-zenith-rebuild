import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createLandingTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    multipleStatements: true
  });

  try {
    console.log('📊 Connected to MySQL database');
    
    const sqlScript = fs.readFileSync('/tmp/create_landing_tables.sql', 'utf-8');
    
    console.log('🔨 Creating landing page tables...');
    await connection.query(sqlScript);
    
    console.log('✅ Landing page tables created successfully!');
    console.log('📋 Tables created: about_settings, president_message_settings, partner_settings, partners');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createLandingTables().catch(console.error);
