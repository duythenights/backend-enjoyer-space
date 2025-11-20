import { publish } from "../rabbitmq";

export async function publishUserRegistered(user: any) {
  publish("auth.exchange", "user.registered", {
    id: user.id,
    email: user.email,
  });
}
