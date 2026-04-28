const prisma = require('./src/config/prisma');

async function debug() {
    try {
        console.log("--- DB DEBUG START ---");
        const allUsers = await prisma.users.findMany();
        console.log("Total Users in DB:", allUsers.length);
        
        allUsers.forEach(u => {
            console.log(`User ID: ${u.id}, Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`);
        });

        const allStudents = await prisma.students.findMany();
        console.log("Total Students in DB:", allStudents.length);
        
        allStudents.forEach(s => {
            console.log(`Student user_id: ${s.user_id}, Class: ${s.class_name}, Enroll: ${s.enrollment_number}`);
        });
        
        console.log("--- DB DEBUG END ---");
    } catch (err) {
        console.error("DEBUG ERROR:", err.message);
    } finally {
        process.exit();
    }
}

debug();
