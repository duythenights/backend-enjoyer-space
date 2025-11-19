import express from "express";
import dotenv from "dotenv";
import { consumeUserRegistered, consumeWelcomeGenerated } from "./rabbitmq";

dotenv.config();

const app = express();
app.use(express.json());

app.listen(3001, async () => {
  console.log("Mail-service running at :3001");
  await consumeWelcomeGenerated();
});
