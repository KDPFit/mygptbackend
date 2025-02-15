const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://mygptbackend.onrender.com/chat", {
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
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: "Error fetching response" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
