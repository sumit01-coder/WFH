const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace(/labels\s+String\[\]\s+@default\(\[\]\)/g, 'labels Json @default("[]")');
schema = schema.replace(/mentions\s+String\[\]\s+@default\(\[\]\)/g, 'mentions Json @default("[]")');

fs.writeFileSync(schemaPath, schema);
