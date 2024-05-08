const http = require('http');
const fs = require('fs');
const Groq = require('groq-sdk');
const readline = require('readline');

const apiKey = "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"; 
const groq = new Groq({ apiKey });

 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Predetermined words that 
const tourismWords = [
    "attractions",
    "hotels",
    "hotel",
    "restaurants",
    "food",
    "meals",
    "history",
    "fun",
    "outdoor",
    "activities",
];

// Function to validate user input against predefined words
function validateInput(input) {
    // Convert input to lowercase for case-insensitive comparison
    const lowerInput = input.toLowerCase();
    // Check if any of the predefined words are present in the input
    return tourismWords.some(word => lowerInput.includes(word));
}

// Function to send message to Groq API and get response
async function sendMessage(message) {
    try {
        // Add constraint for Stockholm to the search message
        const messageWithFilter = `${message} create a custom tourism planning that includes these and some other things in Stockholm`;

        // Send the filtered message to the Groq API
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: messageWithFilter }],
            model: 'mixtral-8x7b-32768'
        });

        return response.choices[0]?.message?.content || 'No response';
    } catch (error) {
        return 'An error occurred';
    }
}

// Creating a server for the website
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/send-message') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { message } = JSON.parse(body);
            // Validate user input against predefined words
            if (validateInput(message)) {
                // User input is valid, send message to Groq API
                const response = await sendMessage(message);
                // Send the response back to the client
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: response }));
            } else {
                // Invalid input
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid input. Please include one of the predefined words." }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Starting server.
const PORT = 2999;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
