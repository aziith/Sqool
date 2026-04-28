const routes = [
    './routes/auth',
    './routes/institutions',
    './routes/attendance',
    './routes/exams',
    './routes/fees',
    './routes/announcements',
    './routes/academics',
    './routes/library',
    './routes/homework',
    './routes/admin_features',
    './routes/admissions',
    './routes/events',
    './routes/timetable',
    './routes/students',
    './routes/teachers',
    './routes/circulars',
    './routes/academic/classes',
    './routes/academic/subjects',
    './routes/academic/timetable',
    './routes/academic/syllabus',
    './routes/academic/lessons',
    './routes/academic/assignments',
    './routes/academic/materials',
    './routes/academic/calendar',
    './routes/academic/analytics',
    './routes/faculty/profiles',
    './routes/faculty/assignments',
    './routes/faculty/attendance',
    './routes/faculty/payroll',
    './routes/faculty/analytics',
    './routes/dashboard/admin'
];

console.log("Starting route import test...");

for (const route of routes) {
    try {
        console.log(`Importing ${route}...`);
        require(route);
        console.log(`SUCCESS: ${route} loaded.`);
    } catch (err) {
        console.error(`FAILURE in ${route}:`, err.message);
        // We don't exit here to see if others fail too, 
        // but if it's a hard crash (like segment fault or process.exit), this loop will stop.
    }
}

console.log("Import test finished.");
