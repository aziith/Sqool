const axios = require('axios');
const API_CLASSES = 'http://localhost:5002/api/academic/classes?institution_id=3';
const API_SUBJECTS = 'http://localhost:5002/api/academic/subjects?institution_id=3';

async function test() {
    try {
        const clsRes = await axios.get(API_CLASSES);
        console.log('Classes Response (Status:', clsRes.status, '):', clsRes.data);
        const subRes = await axios.get(API_SUBJECTS);
        console.log('Subjects Response (Status:', subRes.status, '):', subRes.data);
    } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
    }
}
test();
