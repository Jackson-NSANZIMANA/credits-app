import prisma from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/tokens.js";

export const loginUser = async (phone_number, password) => {
  const user = await prisma.users.findUnique({ where: { phone_number } });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  const token = generateToken(user);
  return { user: user.full_name, token };
};

export const signupUser = async (full_name, password, phone_number) => {
  const user = await prisma.users.create({
    data: { full_name, password, phone_number },
  });
  const token = generateToken(user);
  return { user: user.full_name, token };
};
