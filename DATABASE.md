# Database Configuration

## Default Database: MySQL (Hostinger)

This project is configured to use **MySQL as the primary and default database**.

### Connection Details
- **Host**: srv1849.hstgr.io
- **Port**: 3306
- **Database**: u613266227_test
- **User**: u613266227_test
- **Driver**: mysql2
- **ORM**: Drizzle ORM

### Configuration Files
- **`server/db.ts`**: MySQL connection pool configuration
- **`drizzle.config.ts`**: Drizzle Kit configuration for migrations
- **`shared/schema.ts`**: Database schema (23 tables)

### Database Schema (23 Tables)
1. **sessions** - Session storage for authentication
2. **users** - User accounts and profiles
3. **clubs** - Club information and profiles
4. **club_memberships** - User club memberships
5. **club_events** - Club events
6. **event_participants** - Event attendance tracking
7. **club_gallery** - Club photo galleries
8. **club_reviews** - Club reviews and ratings
9. **booking_events** - Bookable events
10. **booking_page_settings** - Booking page configuration
11. **theme_settings** - Global theme settings
12. **media_assets** - Media library
13. **navbar_settings** - Navigation bar configuration
14. **hero_settings** - Hero section settings
15. **landing_sections** - Landing page sections
16. **section_blocks** - Section content blocks
17. **focus_items** - Focus/features items
18. **team_members** - Team member profiles
19. **landing_testimonials** - Testimonials
20. **site_stats** - Site statistics
21. **contact_settings** - Contact information
22. **footer_settings** - Footer configuration
23. **seo_settings** - SEO metadata

### Demo Data Included
- **3 Clubs**: Atlas Hikers Club, Desert Explorers, Coastal Adventures
- **3 Booking Events**: Atlas Mountains Trek, Sahara Desert Adventure, Atlantic Coast Surf Camp
- **Complete CMS Content**: Hero settings, testimonials, team members, site stats, contact info, etc.

### Database Management Commands

#### Push Schema Changes
```bash
npm run db:push
```
If you encounter data-loss warnings:
```bash
npm run db:push --force
```

#### Access Drizzle Studio (Visual Database Manager)
```bash
npm run db:studio
```

### Important Notes
- **Never write manual SQL migrations** - Always use `npm run db:push`
- PostgreSQL environment variables exist in Replit but are **NOT USED**
- All database operations go through Drizzle ORM for type safety
- Connection pool is configured with 10 max connections

### Development vs Production
- **Development**: Server runs on port 3001, connects to MySQL
- **Production**: Server runs on port 5000 (or PORT env var), same MySQL database

### Troubleshooting
If you encounter database connection issues:
1. Verify MySQL server is accessible at srv1849.hstgr.io:3306
2. Check credentials in `server/db.ts`
3. Ensure firewall allows connections from Replit IP addresses
4. Check database user permissions on Hostinger panel
