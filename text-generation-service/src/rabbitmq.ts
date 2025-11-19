import * as amqp from "amqplib";
import { generateText } from "./gemini";

let pubChannel: amqp.Channel | null = null;
let connection: amqp.Connection | null = null;

export async function connectRabbit() {
  if (pubChannel) return pubChannel;

  const url = process.env.RABBIT_URL!;
  let retries = 20;

  while (retries > 0) {
    try {
      console.log("🔌 Connecting RabbitMQ...");
      connection = await amqp.connect(url);
      pubChannel = await connection.createChannel();
      console.log("🐇 RabbitMQ connected!");
      return pubChannel;
    } catch (err) {
      console.log("⏳ RabbitMQ not ready, retrying in 2s...");
      retries--;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  throw new Error("❌ Cannot connect RabbitMQ");
}

// ---------- PUBLISHER ----------
export async function publish(exchange: string, routingKey: string, msg: any) {
  const ch = await connectRabbit(); // đảm bảo pubChannel luôn có

  await ch.assertExchange(exchange, "topic", { durable: true });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));

  console.log("📤 Published:", routingKey, msg);
}

export async function publishTextGenerated(routingKey: string, message: any) {
  const exchange = "text.exchange";
  const ch = await connectRabbit();

  await ch.assertExchange(exchange, "topic", { durable: true });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

  console.log("📤 Published:", routingKey, message);
}

// ---------- CONSUMER ----------
export async function consumeUserRegistered() {
  const url = process.env.RABBIT_URL!;
  const conn = await amqp.connect(url); // consumer dùng connection riêng
  const ch = await conn.createChannel();

  const exchange = "auth.exchange";
  const queue = "text.user.registered";
  const rk = "user.registered";

  await ch.assertExchange(exchange, "topic", { durable: true });
  await ch.assertQueue(queue, { durable: true });
  await ch.bindQueue(queue, exchange, rk);

  console.log("✔ Text-service waiting for user.registered...");

  ch.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      console.log("📝 Received user.registered:", data);

      const funnyGreeting = await generateText(
        `Tạo một câu chào mừng người dùng mới, hài hước, có sử dụng email: ${data.email} và tôi 1 cần đáp án cụ thể, đừng đưa ra lựa chọn`
      );

      // Dùng publisher chuẩn
      await publishTextGenerated("user.welcome.generated", {
        email: data.email,
        greeting: funnyGreeting,
      });
      console.log("hehe");

      ch.ack(msg);
    } catch (err) {
      console.log("⚠️ Failed generating text, requeue...");
      ch.nack(msg, false, true); // true = retry
    }
  });
}
