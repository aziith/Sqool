const axios = require('axios');

async function testOtpRoute() {
    try {
        const response = await axios.post('http://localhost:5002/api/auth/request-otp', {
            identifier: 'test@example.com'
        });
        console.log('OTP Route Test Success:', response.data);
    } catch (error) {
        console.error('OTP Route Test Failed:', error.response ? error.response.status : error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

testOtpRoute();
