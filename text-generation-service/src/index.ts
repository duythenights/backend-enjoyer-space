import express from "express";
import dotenv from "dotenv";
import {
  connectRabbit,
  consumeUserRegistered,
  publishTextGenerated,
} from "./rabbitmq";
import { generateText } from "./gemini";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const text = await generateText(prompt);

  publishTextGenerated(prompt, text);

  res.json({ prompt, text });
});

app.listen(3002, async () => {
  await connectRabbit();
  await consumeUserRegistered();
  console.log("Text-generation-service running at :3002");
});
