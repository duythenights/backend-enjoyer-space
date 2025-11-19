import express from "express";
import dotenv from "dotenv";
import { connectRabbit } from "./rabbitmq";
import { register } from "./controllers/authController";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Hello World!" }));
app.post("/register", register);
console.log("test reload");

app.listen(3000, async () => {
  await connectRabbit();
  console.log("Auth-service running at :3000");
});
