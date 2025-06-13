import { StatusCodes } from "http-status-codes";
import customError from "./customError.js";
class unauthenticatedError extends customError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export default unauthenticatedError;
