const http = require('http');

const data = JSON.stringify({
    institution_id: 1,
    applicant_name: "Test Native HTTP",
    gender: "Male",
    class_applied: "10",
    parent_name: "Parent",
    parent_phone: "1234567890",
    email: "test_native@example.com",
    address: "Test Address",
    current_address: "Test Address",
    guardian_id_proof: "ID123",
    student_id_proof: "SID123"
});

const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/admissions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
