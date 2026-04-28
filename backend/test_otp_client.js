const http = require('http');

const data = JSON.stringify({
    identifier: 'beetsplay@gmail.com'
});

const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/auth/request-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing OTP request...');

const req = http.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
        
        if (res.statusCode === 200) {
            console.log('OTP request successful!');
        } else {
            console.error('OTP request failed.');
        }
    });
});

req.on('error', (err) => {
    console.error('Test Error (Make sure server is running on 5002):', err.message);
});

req.write(data);
req.end();
