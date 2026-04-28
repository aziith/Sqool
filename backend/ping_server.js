const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 5002,
  path: '/api/academic/rooms',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});

req.on('error', e => console.error('Error:', e));
req.write(JSON.stringify({ institution_id: 3, room_number: "2010" }));
req.end();
