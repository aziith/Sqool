async function verifySubject() {
    try {
        const body = {
            institution_id: 1,
            class_id: 1,
            name: "Advanced Mathematics",
            code: "MATH-02",
            max_marks: 100
        };
        const resp = await fetch('http://127.0.0.1:5000/api/academic/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        console.log('Subject Save Status:', resp.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Verification failed:', err.message);
    }
}

verifySubject();
