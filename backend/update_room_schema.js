const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// The new models
const addition = `

model Room {
  id          String   @id @default(uuid())
  institution_id Int?
  name        String
  type        RoomType
  capacity    Int
  building    String?
  floor       String?
  facilities  String[] 
  status      RoomStatus @default(AVAILABLE)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  allocations Allocation[]
  institutions institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
  
  @@map("rooms")
}

model Allocation {
  id         String   @id @default(uuid())
  institution_id Int?
  roomId     String
  room       Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)

  className  String
  section    String
  subject    String
  teacher    String

  date       DateTime @db.Date
  startTime  DateTime @db.Time
  endTime    DateTime @db.Time

  createdAt  DateTime @default(now())
  institutions institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)

  @@index([roomId, date])
  @@map("allocations")
}

enum RoomType {
  CLASSROOM
  LAB
  EXAM_HALL
}

enum RoomStatus {
  AVAILABLE
  OCCUPIED
  MAINTENANCE
}
`;

if (!schema.includes('model Room {')) {
  // First, remove any existing "rooms" table from schema if present. But I already know it's not present because I checked lines 1-100 and Prisma db push hasn't run.
  // Wait, `institutions` model must be updated to have Room and Allocation relations. I'll just append and Prisma will complain about institutions missing opposite relations. Let's dynamically add them.
  schema = schema.replace(
    /model institutions \{[\s\S]+?\}/, 
    (match) => match.replace(/}$/, '  rooms rooms[]\n  allocations allocations[]\n}')
  );
  
  fs.writeFileSync(schemaPath, schema + addition);
  console.log("Schema updated.");
} else {
  console.log("Models already exist.");
}
