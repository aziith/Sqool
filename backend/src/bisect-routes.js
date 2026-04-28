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

async function test() {
    for (const route of routes) {
        process.stdout.write(`Testing ${route}... `);
        try {
            require(route);
            console.log("OK");
        } catch (err) {
            console.log("FAILED");
            console.error(err);
            process.exit(1);
        }
    }
}

test();
