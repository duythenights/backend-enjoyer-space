import * as amqp from "amqplib";
import { sendMail } from "./services/mailService";

// ========= SHARED RABBITMQ CONNECTION =========
let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export async function getRabbitChannel() {
  if (channel) return channel;

  const url = process.env.RABBIT_URL!;
  let retries = 20;

  while (retries > 0) {
    try {
      console.log("🔌 Connecting to RabbitMQ...");
      connection = await amqp.connect(url);
      channel = await connection.createChannel();
      console.log("🐇 RabbitMQ connected!");
      return channel;
    } catch (err) {
      console.log("⏳ RabbitMQ not ready, retrying in 2s...");
      retries--;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  throw new Error("❌ Could not connect RabbitMQ after retries.");
}

// ========= CONSUMER 1: user.registered =========
export async function consumeUserRegistered() {
  const channel = await getRabbitChannel();

  const exchange = "auth.exchange";
  const queue = "mail.user.registered";
  const rk = "user.registered";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, rk);

  console.log("✔ Mail-service waiting for user.registered...");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("📩 Received:", data);

    await sendMail(
      data.email,
      "Welcome to our system",
      `<h1>Hello!</h1><p>Thanks for registering ${data.email}</p>`
    );

    channel.ack(msg);
  });
}

// ========= CONSUMER 2: user.welcome.generated =========
export async function consumeWelcomeGenerated() {
  const channel = await getRabbitChannel();

  const exchange = "text.exchange";
  const queue = "mail.user.welcome.generated";
  const rk = "user.welcome.generated";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, rk);

  console.log("✔ Mail-service waiting for welcome message...");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("🎉 Received welcome:", data);

    await sendMail(data.email, "Welcome Aboard!", `<h1>${data.greeting}</h1>`);

    channel.ack(msg);
  });
}
