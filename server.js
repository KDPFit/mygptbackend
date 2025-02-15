const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Ensures JSON is properly parsed

// ✅ Homepage Route (Confirms server is running)
app.get("/", (req, res) => {
    res.send("My-GPT backend is running! ✅");
});

// ✅ Chat Route (Handles GPT requests)
app.post("/chat", async (req, res) => {
    try {
        console.log("Received request:", req.body); // ✅ Logs the incoming request for debugging

        // ✅ Check if a message was sent in the request
        if (!req.body || !req.body.message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const userMessage = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 250
            })
        });

        const data = await response.json();

        // ✅ Handle possible API response errors
        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ error: "Invalid response from OpenAI" });
        }

        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error fetching response from OpenAI" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
