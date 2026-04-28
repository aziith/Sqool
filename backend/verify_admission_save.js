async function verifyAdmission() {
    try {
        const body = {
            institution_id: 1,
            applicant_name: "Test Student",
            gender: "Male",
            class_applied: "Grade 10",
            parent_name: "Parent Name",
            parent_phone: "1234567890",
            email: "test@student.com",
            address: "Test Address",
            current_address: "Test Address",
            guardian_id_proof: "ID123",
            student_id_proof: "SID123"
        };
        const resp = await fetch('http://127.0.0.1:5000/api/admissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        console.log('Admission Save Status:', resp.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Verification failed:', err.message);
    }
}

verifyAdmission();
