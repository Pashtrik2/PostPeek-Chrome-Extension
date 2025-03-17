const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/generate", async (req, res) => {
  const { idea } = req.body;

  const prompt = `Shkruaj 3 versione të këtij postimi për rrjete sociale të ndryshme:

1. LinkedIn – Përdor ton profesional dhe formal. Fokusohu te arritja dhe impakti në komunitetin profesional.
2. Instagram – Bëje më emocional, kreativ dhe përdor emoji dhe hashtags.
3. X (Twitter) – Bëje të shkurtër, të drejtpërdrejtë dhe me një stil dinamik. Përdor hashtags efektivë.

Postimi: "${idea}"`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    const result = completion.data.choices[0].message.content;
    const [linkedin, instagram, twitter] = result.split(/\n\d+\./).slice(1).map(p => p.trim());
    res.json({ linkedin, instagram, twitter });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});