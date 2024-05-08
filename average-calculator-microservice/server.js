const express = require('express');
const axios = require('axios');
const { performance } = require('perf_hooks');

const app = express();
const port = 3000;

const windowSize = 10;
let storedNumbers = [];

async function fetchNumbers(numberId) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/{numberid}`, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        console.error('Error fetching prime numbers:', error.message);
        return [];
    }
}
function updateStoredNumbers(numbers) {
    numbers.forEach(num => {
        if (!storedNumbers.includes(num)) {
            storedNumbers.push(num);
        }
    });
    if (storedNumbers.length > windowSize) {
        storedNumbers = storedNumbers.slice(-windowSize);
    }
}
function calculateAverage() {
    const sum = storedNumbers.reduce((acc, num) => acc + num, 0);
    return sum / storedNumbers.length || 0;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;
    const startTime = performance.now();
    const numbers = await fetchNumbers(numberId);
    updateStoredNumbers(numbers);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    if (elapsedTime > 500) {
        return res.status(500).json({ error: 'Response took longer than 500 ms' });
    }
    const avg = calculateAverage();
    res.json({
        windowPrevState: storedNumbers.slice(0, -numbers.length),
        windowCurrState: storedNumbers.slice(-windowSize),
        numbers: numbers,
        avg: avg.toFixed(2)
    });
});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
