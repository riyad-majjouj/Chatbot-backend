const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// السماح للفرونت إند بالوصول إلى السيرفر
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: "يجب إرسال سؤال" });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: userQuestion }]
                }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("📩 طلب مرسل إلى Gemini:", userQuestion);
        console.log("📥 استجابة API:", response.data);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            res.json({ answer: response.data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "لم يتم العثور على رد من Gemini" });
        }

    } catch (error) {
        console.error("❌ خطأ أثناء الاتصال بـ Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "حدث خطأ أثناء جلب الرد" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
});
