import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { customError } from "../errors/index.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Please try again later.",
  };

  // Handle Prisma duplicate key error
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    const fields = err.meta?.target?.join(", ") || "field";
    customError.msg = `Duplicate value for: ${fields}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Optionally handle other Prisma errors here

  res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
