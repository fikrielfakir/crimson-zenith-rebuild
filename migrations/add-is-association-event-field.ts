import mysql from 'mysql2/promise';

/**
 * Migration: Add is_association_event field and make club_id nullable
 * This allows events to be either club-specific or Journey Association events
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
    
    // Check if is_association_event column exists
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM club_events LIKE 'is_association_event'`
    );
    
    if ((columns as any[]).length === 0) {
      console.log('➕ Adding is_association_event column to club_events table...');
      await connection.query(
        `ALTER TABLE club_events ADD COLUMN is_association_event TINYINT(1) DEFAULT 0 AFTER club_id`
      );
      console.log('✅ is_association_event column added successfully');
    } else {
      console.log('ℹ️  is_association_event column already exists');
    }
    
    // Make club_id nullable
    console.log('🔄 Making club_id nullable for association events...');
    await connection.query(
      `ALTER TABLE club_events MODIFY COLUMN club_id INT NULL`
    );
    console.log('✅ club_id is now nullable');
    
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
