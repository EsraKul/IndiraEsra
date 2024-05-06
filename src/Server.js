const http = require('http');
const fs = require('fs');
const Groq = require('groq-sdk');
const readline = require('readline');

const apiKey = "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";
const groq = new Groq({ apiKey });

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//this part basically lets you send a message to the api and get a response back. 
async function sendMessage(message) {
    try {
        //takes the message and returns a response. 
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'mixtral-8x7b-32768' 
        });

        return response.choices[0]?.message?.content || 'No response';
    } catch (error) { //otherwise returns an error. 
        return 'An error occurred';
    }
}

// This creates a new server for the website. A server is required to make the groq api work, otherwise it only works in the terminal. 
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
            const response = await sendMessage(message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: response }));
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running`);
});
