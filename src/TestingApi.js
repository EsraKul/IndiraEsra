"use strict";
const Groq = require("groq-sdk");
const apiKey = "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";
const groq = new Groq({
    apiKey: apiKey
});
async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    process.stdout.write(chatCompletion.choices[0]?.message?.content || "");
}
async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Mention where tourists should visit if they like HISTORY, in stockholm"
            }
        ],
        model: "mixtral-8x7b-32768"
    });
}
module.exports = {
    main,
    getGroqChatCompletion
};

main();