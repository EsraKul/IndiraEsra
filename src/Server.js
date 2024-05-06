const http = require('http');
const fs = require('fs');
const Groq = require('groq-sdk');
const readline = require('readline');

const apiKey = "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"; // Replace with your Groq API key
const groq = new Groq({ apiKey });

//readline interface for reading input. 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Predetermined words, if these words are not included the search doesn't work --this is to avoid the api from returning anything but tourist things. 
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
    "acitivites",

];

// Function to validate user input against predefined words
function validateInput(input) {
    // Convert input to lowercase for case-insensitive comparison
    const lowerInput = input.toLowerCase();
    // Check if any of the predefined words are present in the input
    return tourismWords.some(word => lowerInput.includes(word));
}

//this part basically lets you send a message to the api and get a response back. 
async function sendMessage(message) {
    try {
        //this puts a constraint where it adds stockholm to the search, this is to only include the scope stockholm!
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

// Create a new server for the website
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
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: response }));
            } else {
                // Invalid input, send error response
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid input. Please include one of the predefined words." }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Start server.
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});