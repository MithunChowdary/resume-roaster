const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    try {
        console.log("Testing Groq Connectivity...");
        console.log("Key prefix:", process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) : "MISSING");

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "llama-3.3-70b-versatile",
        });

        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (err) {
        console.error("Groq Connection Failed:", err);
    }
}

main();
