const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => res.send('Server is alive!'));

app.listen(PORT, () => {
    console.log(`Dummy server running on port ${PORT}`);
    process.exit(0); // Exit immediately after starting successfully
});
