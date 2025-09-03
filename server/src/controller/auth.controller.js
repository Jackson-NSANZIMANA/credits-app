import { loginUser, signupUser } from "../services/auth.service.js";
import { unauthenticatedError, badRequestError } from "../errors/index.js";
const login = async (req, res) => {
  const { phone_number, password } = req.body;
  if (!phone_number || !password) {
    throw new badRequestError("Please provide phone number and password");
  }
  const result = await loginUser(phone_number, password);
  if (!result) {
    throw new unauthenticatedError("Invalid phone number or password");
  }
  res.status(200).json({ mesage: `🙋‍♂️ Hey ${result.user}, Login successful` })
};

const signup = async (req, res) => {
  const { full_name, password, phone_number } = req.body;
  if (!full_name || !password || !phone_number) {
    throw new badRequestError("Please provide phone number and password");
  }
  const result = await signupUser(full_name, password, phone_number);
  res.status(201).json({ message: "Account created" });
};

export { login, signup };
