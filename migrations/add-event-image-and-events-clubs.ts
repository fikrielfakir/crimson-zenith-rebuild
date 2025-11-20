import mysql from 'mysql2/promise';

/**
 * Migration: Add image column to club_events and create events_clubs junction table
 * Run this migration to update the database schema
 */

if (!process.env.MYSQL_HOST || !process.env.MYSQL_PASSWORD) {
  throw new Error('Missing required environment variables: MYSQL_HOST, MYSQL_PASSWORD');
}

const config = {
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  database: process.env.MYSQL_DATABASE || 'u613266227_test',
  user: process.env.MYSQL_USER || 'u613266227_test',
  password: process.env.MYSQL_PASSWORD,
};

async function runMigration() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('🔄 Starting migration...');
    
    // Check if image column exists in club_events
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM club_events LIKE 'image'`
    );
    
    if ((columns as any[]).length === 0) {
      console.log('➕ Adding image column to club_events table...');
      await connection.query(
        `ALTER TABLE club_events ADD COLUMN image VARCHAR(500) NULL AFTER description`
      );
      console.log('✅ Image column added successfully');
    } else {
      console.log('ℹ️  Image column already exists in club_events');
    }
    
    // Check if events_clubs table exists
    const [tables] = await connection.query(
      `SHOW TABLES LIKE 'events_clubs'`
    );
    
    if ((tables as any[]).length === 0) {
      console.log('➕ Creating events_clubs junction table...');
      await connection.query(`
        CREATE TABLE events_clubs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          event_id INT NOT NULL,
          club_id INT NOT NULL,
          is_primary_club TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE,
          FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
          INDEX idx_event_id (event_id),
          INDEX idx_club_id (club_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ events_clubs table created successfully');
    } else {
      console.log('ℹ️  events_clubs table already exists');
    }
    
    console.log('✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run migration if executed directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { runMigration };
