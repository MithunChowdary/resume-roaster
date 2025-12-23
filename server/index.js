const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
let pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config();

// Ensure pdf-parse is loaded correctly
if (typeof pdfParse !== 'function' && pdfParse.default) {
    pdfParse = pdfParse.default;
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const RoastSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    mode: { type: String, enum: ['roast', 'ats'], required: true },
    language: String,
    resumeTextLength: Number,
    roastData: Object, // Store the full roast/ATS result
    atsScore: Number
});

const Roast = mongoose.model('Roast', RoastSchema);

app.get('/api/stats', async (req, res) => {
    try {
        const count = await Roast.countDocuments();
        res.setHeader('Cache-Control', 'no-store');
        res.json({ totalProcessed: count });
    } catch (e) {
        console.error("Stats Error:", e);
        res.json({ totalProcessed: 0 });
    }
});

function getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
        console.error("CRITICAL ERROR: GROQ_API_KEY is missing from environment variables.");
        return null;
    }
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function extractJSON(text) {
    try {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) return JSON.parse(match[1]);
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        }
        return JSON.parse(text);
    } catch (e) { return null; }
}

app.post('/api/roast', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No resume file uploaded' });

        console.log(`[ROAST] Processing file: ${req.file.originalname}`);
        const language = req.body.language || 'English';

        const dataBuffer = fs.readFileSync(req.file.path);
        let resumeText = "";
        try {
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;
        } catch (pdfError) {
            console.error("[ROAST] PDF Parse Error:", pdfError);
            return res.status(500).json({ error: 'Failed to read PDF file.' });
        } finally {
            try { if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch (e) { }
        }

        if (resumeText.trim().length < 50) return res.status(400).json({ error: 'Resume text is too specific or empty.' });

        const groq = getGroqClient();
        if (!groq) return res.status(500).json({ error: 'Server misconfiguration: AI Key missing.' });

        const prompt = `
        First, determine if the input text resembles a professional Resume or CV. 
        If it is obviously NOT a resume (e.g., a novel, code file text, cooking recipe, random gibberish), return EXACTLY:
        { "error": "Not a Resume", "details": "This document does not look like a resume. Please upload a valid CV." }

        If it IS a resume, proceed to be the darker, most cynical, soul-crushing senior tech recruiter in existence. You don't just roast; you destroy dreams. 
        The job market is brutal, and this candidate has NO CHANCE. Tell them why.
        
        Analyze this resume and provide a BRUTAL reality check. Make them cry. Point out every flaw, every cliché, every weak project.
        
        You must generate the response in THREE languages/styles.
        **CRITICAL**: For each language, return an ARRAY of exactly 5 savage bullet points. Not a paragraph.
        
        1. English: Pure, unadulterated savage English.
        2. Hindi (Hinglish): A mix of Hindi and English, using Bollywood slang or Desi insults where appropriate.
        3. Telugu (Tanglish): A mix of Telugu and English, using local slang/tollywood references if fitting.
        
        IMPORTANT: You must return ONLY valid JSON.
        Format when valid:
        { 
            "roast": {
                "english": ["Savage point 1", "Savage point 2", "Savage point 3", "Savage point 4", "Savage point 5"],
                "hindi": ["Hinglish point 1", "Hinglish point 2", "Hinglish point 3", "Hinglish point 4", "Hinglish point 5"],
                "telugu": ["Tanglish point 1", "Tanglish point 2", "Tanglish point 3", "Tanglish point 4", "Tanglish point 5"]
            },
            "improvements": ["Violent but helpful tip 1", "Violent but helpful tip 2", "Violent but helpful tip 3"] 
        }
        
        Resume:
        ${resumeText.substring(0, 15000)}
        `;

        console.log("[ROAST] Sending request to Groq AI...");
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 1,
            max_tokens: 3000,
            response_format: { type: "json_object" },
        });

        const jsonResponse = extractJSON(completion.choices[0].message.content);
        if (!jsonResponse) throw new Error("Failed to parse AI response as JSON");

        // Save to DB
        await Roast.create({
            mode: 'roast',
            language: language,
            resumeTextLength: resumeText.length,
            roastData: jsonResponse
        });

        console.log("[ROAST] Success! Saved to DB.");
        res.json(jsonResponse);

    } catch (error) {
        console.error("[ROAST] Critical Error:", error);
        res.status(500).json({ error: 'Roasting failed', details: error.message });
    }
});

app.post('/api/ats-check', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No resume file uploaded' });

        console.log(`[ATS] Processing file: ${req.file.originalname}`);

        const dataBuffer = fs.readFileSync(req.file.path);
        let resumeText = "";
        try {
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;
        } catch (pdfError) {
            console.error("[ATS] PDF Parse Error:", pdfError);
            return res.status(500).json({ error: 'Failed to read PDF file.' });
        } finally {
            try { if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch (e) { }
        }

        if (resumeText.trim().length < 50) return res.status(400).json({ error: 'Resume text is too specific or empty.' });

        const groq = getGroqClient();
        if (!groq) return res.status(500).json({ error: 'Server misconfiguration: AI Key missing.' });

        const prompt = `
        Act as an Application Tracking System (ATS) Expert. 
        Analyze this resume for keyword optimization, formatting issues, and readability.
        
        IMPORTANT: You must return ONLY valid JSON.
        Format: 
        { "ats_score": 0, "keywords_found": ["kw1", "kw2"], "missing_important_keywords": ["kw1", "kw2"], "formatting_issues": ["issue1"], "summary": "..." }
        
        Resume:
        ${resumeText.substring(0, 15000)}
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: "json_object" },
        });

        const jsonResponse = extractJSON(completion.choices[0].message.content);
        if (!jsonResponse) throw new Error("Failed to parse AI response as JSON");

        // Save to DB
        await Roast.create({
            mode: 'ats',
            resumeTextLength: resumeText.length,
            atsScore: jsonResponse.ats_score,
            roastData: jsonResponse
        });

        res.json(jsonResponse);

    } catch (error) {
        console.error("[ATS] Critical Error:", error);
        res.status(500).json({ error: 'ATS Scan failed', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
