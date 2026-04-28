async function testAPI() {
    try {
        console.log('Testing Classes API...');
        const classesResp = await fetch('http://127.0.0.1:5000/api/academic/classes?institution_id=1');
        const classes = await classesResp.json();
        console.log('Classes Response:', Array.isArray(classes) ? `Received ${classes.length} items` : classes);

        console.log('Testing Exams API...');
        const examsResp = await fetch('http://127.0.0.1:5000/api/exams?institution_id=1');
        const exams = await examsResp.json();
        console.log('Exams Response:', Array.isArray(exams) ? `Received ${exams.length} items` : exams);

        if (Array.isArray(classes) && Array.isArray(exams)) {
            console.log('API Verification Successful');
        } else {
            console.warn('API returned unexpected format');
        }
    } catch (err) {
        console.error('API Verification Failed:', err.message);
    }
}

testAPI();
