"use strict";
const Groq = require("groq-sdk");
const readline = require('readline');
const apiKey = "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";
const groq = new Groq({
    apiKey: apiKey
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to send message to Groq API and display response
async function sendMessage(message) {
    try {
        // Send message to Groq API
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'mixtral-8x7b-32768' // Adjust model based on your setup
        });

        // Display response
        console.log('Groq:', response.choices[0]?.message?.content || 'No response');
    } catch (error) {
        console.error('Error:', error.message || 'An error occurred');
    }
}

// Function to start conversation loop
async function startConversation() {
    // Prompt user for input
    rl.question('You: ', async (input) => {
        // Send user input to Groq API
        await sendMessage(input);

        // Continue conversation loop
        startConversation();
    });
}

// Start conversation.
startConversation();
