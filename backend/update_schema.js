const fs = require('fs');

const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace blocks to inject reverse relations
schema = schema.replace(
  'model classes {\n',
  'model classes {\n  syllabuses Syllabus[]\n  lesson_plans LessonPlan[]\n  assignments Assignment[]\n  study_materials StudyMaterial[]\n'
);

schema = schema.replace(
  'model subjects {\n',
  'model subjects {\n  syllabuses Syllabus[]\n  lesson_plans LessonPlan[]\n  assignments Assignment[]\n  study_materials StudyMaterial[]\n'
);

schema = schema.replace(
  'model users {\n',
  'model users {\n  syllabuses Syllabus[]\n  lesson_plans LessonPlan[]\n  assignments_given Assignment[]\n  assignment_submissions AssignmentSubmission[]\n  study_materials StudyMaterial[]\n'
);

schema = schema.replace(
  'model institutions {\n',
  'model institutions {\n  syllabuses Syllabus[]\n  lesson_plans LessonPlan[]\n  assignments Assignment[]\n  study_materials StudyMaterial[]\n  academic_events AcademicEvent[]\n'
);

// New Models
const newModels = `
model Syllabus {
  id              Int       @id @default(autoincrement())
  institution_id  Int?
  class_id        Int?
  subject_id      Int?
  assigned_to     Int?
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  classes         classes?  @relation(fields: [class_id], references: [id], onDelete: Cascade)
  subjects        subjects? @relation(fields: [subject_id], references: [id], onDelete: Cascade)
  institutions    institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
  users           users?    @relation(fields: [assigned_to], references: [id], onDelete: SetNull)
  topics          Topic[]
}

model Topic {
  id              Int       @id @default(autoincrement())
  syllabus_id     Int?
  title           String    @db.VarChar(255)
  description     String?
  completion_status Boolean @default(false)
  completion_date DateTime? @db.Date
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  syllabus        Syllabus? @relation(fields: [syllabus_id], references: [id], onDelete: Cascade)
}

model LessonPlan {
  id              Int       @id @default(autoincrement())
  institution_id  Int?
  class_id        Int?
  subject_id      Int?
  teacher_id      Int?
  topic           String    @db.VarChar(255)
  date            DateTime  @db.Date
  homework        String?
  materials_used  String?
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  classes         classes?  @relation(fields: [class_id], references: [id], onDelete: Cascade)
  subjects        subjects? @relation(fields: [subject_id], references: [id], onDelete: Cascade)
  users           users?    @relation(fields: [teacher_id], references: [id], onDelete: Cascade)
  institutions    institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
}

model Assignment {
  id              Int       @id @default(autoincrement())
  institution_id  Int?
  class_id        Int?
  subject_id      Int?
  teacher_id      Int?
  title           String    @db.VarChar(255)
  description     String?
  file_url        String?   @db.VarChar(255)
  due_date        DateTime  @db.Timestamp(6)
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  classes         classes?  @relation(fields: [class_id], references: [id], onDelete: Cascade)
  subjects        subjects? @relation(fields: [subject_id], references: [id], onDelete: Cascade)
  users           users?    @relation("TeacherAssignments", fields: [teacher_id], references: [id], onDelete: Cascade)
  institutions    institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
  
  submissions     AssignmentSubmission[]
}

model AssignmentSubmission {
  id              Int       @id @default(autoincrement())
  assignment_id   Int?
  student_id      Int?
  file_url        String?   @db.VarChar(255)
  student_note    String?
  submitted_at    DateTime? @default(now()) @db.Timestamp(6)
  grade           String?   @db.VarChar(20)
  feedback        String?

  assignment      Assignment? @relation(fields: [assignment_id], references: [id], onDelete: Cascade)
  users           users?      @relation("StudentSubmissions", fields: [student_id], references: [id], onDelete: Cascade)
}

model StudyMaterial {
  id              Int       @id @default(autoincrement())
  institution_id  Int?
  class_id        Int?
  subject_id      Int?
  teacher_id      Int?
  title           String    @db.VarChar(255)
  description     String?
  file_type       String?   @db.VarChar(50)
  file_url        String    @db.VarChar(255)
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  classes         classes?  @relation(fields: [class_id], references: [id], onDelete: Cascade)
  subjects        subjects? @relation(fields: [subject_id], references: [id], onDelete: Cascade)
  users           users?    @relation(fields: [teacher_id], references: [id], onDelete: Cascade)
  institutions    institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
}

model AcademicEvent {
  id              Int       @id @default(autoincrement())
  institution_id  Int?
  title           String    @db.VarChar(255)
  event_type      String    @db.VarChar(50)
  start_date      DateTime  @db.Date
  end_date        DateTime? @db.Date
  description     String?
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  institutions    institutions? @relation(fields: [institution_id], references: [id], onDelete: Cascade)
}
`;

// Note: Ensure relation names match
schema = schema.replace(
  'assignments_given Assignment[]\n  assignment_submissions AssignmentSubmission[]',
  'assignments_given Assignment[] @relation("TeacherAssignments")\n  assignment_submissions AssignmentSubmission[] @relation("StudentSubmissions")'
);

fs.writeFileSync(schemaPath, schema + newModels);
console.log('Schema updated successfully.');
