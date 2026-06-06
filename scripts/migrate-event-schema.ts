import { pool } from '../server/db.js';

async function runMigration() {
  console.log('🔄 Starting event schema migration...');
  
  try {
    // 1. Add missing fields to club_events table
    console.log('📝 Adding new columns to club_events table...');
    
    const alterTableQueries = [
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS duration VARCHAR(100) NULL AFTER category`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS location_details VARCHAR(255) NULL AFTER location`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS languages VARCHAR(255) NULL AFTER duration`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS min_age INT NULL AFTER languages`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS max_people INT NULL AFTER min_age`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS highlights TEXT NULL AFTER max_people`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS included TEXT NULL AFTER highlights`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS not_included TEXT NULL AFTER included`,
      `ALTER TABLE club_events ADD COLUMN IF NOT EXISTS important_info TEXT NULL AFTER not_included`,
    ];

    for (const query of alterTableQueries) {
      try {
        await pool.query(query);
      } catch (error: any) {
        // Ignore duplicate column errors
        if (!error.message.includes('Duplicate column')) {
          throw error;
        }
      }
    }
    
    console.log('✅ Successfully added columns to club_events table');

    // 2. Create event_gallery table
    console.log('📝 Creating event_gallery table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_gallery table created');

    // 3. Create event_schedule table
    console.log('📝 Creating event_schedule table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        day_number INT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_schedule table created');

    // 4. Create event_reviews table
    console.log('📝 Creating event_reviews table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        user_name VARCHAR(255),
        rating INT NOT NULL,
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_reviews table created');

    // 5. Create event_prices table
    console.log('📝 Creating event_prices table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        travelers INT NOT NULL,
        price_per_person DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (event_id) REFERENCES club_events(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_prices table created');

    console.log('🎉 Event schema migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration().catch(console.error);
