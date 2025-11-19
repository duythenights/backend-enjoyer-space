import * as amqp from "amqplib";

let channel: amqp.Channel | null = null;

export async function connectRabbit() {
  if (channel) return channel;

  const url = process.env.RABBIT_URL!;
  let retries = 20;

  while (retries > 0) {
    try {
      console.log("🔌 Connecting Rabbit...");
      const conn = await amqp.connect(url);
      channel = await conn.createChannel();
      console.log("🐇 Rabbit connected!");
      return channel;
    } catch (err) {
      console.log("⏳ Retry in 2s...");
      await new Promise((res) => setTimeout(res, 2000));
      retries--;
    }
  }

  throw new Error("❌ Cannot connect RabbitMQ");
}

export async function publish(exchange: string, routingKey: string, msg: any) {
  const ch = await connectRabbit(); // 🔥 ĐẢM BẢO channel luôn có

  await ch.assertExchange(exchange, "topic", { durable: true });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));

  console.log("📤 Published:", routingKey, msg);
}
