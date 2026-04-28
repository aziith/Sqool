async function verifyClass() {
    try {
        const body = {
            institution_id: 1,
            name: "Test Class",
            section: "B",
            capacity: 35,
            teacher_id: null
        };
        const resp = await fetch('http://127.0.0.1:5000/api/academic/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        console.log('Class Save Status:', resp.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Verification failed:', err.message);
    }
}

verifyClass();
