function calculateAverage() {
    const numberId = document.getElementById('numberId').value;

    fetch(`http://localhost:3000/numbers/${numberId}`)
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = `
                <h2>Previous State:</h2>
                <p>${data.windowPrevState.join(', ')}</p>
                <h2>Current State:</h2>
                <p>${data.windowCurrState.join(', ')}</p>
                <h2>Numbers from 3rd Party:</h2>
                <p>${data.numbers.join(', ')}</p>
                <h2>Average:</h2>
                <p>${data.avg}</p>
            `;
        })
        .catch(error => console.error('Error:', error));
}
