import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const base = new PrismaClient();

const prisma = base.$extends({
  model: {
    users: {
      async create({ data, ...args }) {
        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }
        return base.users.create({ data, ...args });
      },
    },
  },
});

export default prisma;
