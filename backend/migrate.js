const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Change provider
schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "mysql"');

// 2. Remove PostgreSQL specific UUIDs
// From: @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
// To:   @id @default(uuid())
schema = schema.replace(/@id\s+@default\(dbgenerated\("gen_random_uuid\(\)"\)\)\s+@db\.Uuid/g, '@id @default(uuid())');

// Also catch any non-id fields using gen_random_uuid
schema = schema.replace(/@default\(dbgenerated\("gen_random_uuid\(\)"\)\)\s+@db\.Uuid/g, '@default(uuid())');

// 3. Remove @db.Uuid completely (MySQL doesn't have a native UUID type in Prisma, it uses String)
schema = schema.replace(/@db\.Uuid/g, '');

// 4. Remove @db.Timestamptz()
schema = schema.replace(/@db\.Timestamptz\(\)/g, '');

// 5. Replace time defaults. MySQL doesn't natively support Prisma's dbgenerated time without raw SQL strings that differ.
// Let's just remove the time defaults from the schema and let the app handle it, or use a dummy date for time-only fields.
// In Prisma, MySQL DateTime requires a full ISO-8601 format. Let's just remove the @default for workingHoursStart and workingHoursEnd.
// From: @default(dbgenerated("'09:00:00'::time"))
// To: (nothing)
schema = schema.replace(/@default\(dbgenerated\("'[^']+'::time"\)\)/g, '');

fs.writeFileSync(schemaPath, schema);
console.log('Schema migration complete.');
