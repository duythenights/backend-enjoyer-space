import { Request, Response } from "express";
import { publishUserRegistered } from "../event/authEvent";

export const register = async (req: Request, res: Response) => {
  // giả lập tạo user
  const user = {
    id: Date.now(),
    email: req.body.email,
  };

  await publishUserRegistered(user);

  return res.json({ message: "User registered", user });
};
