import { verify } from "jsonwebtoken";
async function authenicationMiddleware(req, res, next) {
  const authHeader = req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // need to throw an error
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verify(token, process.env.SECRET_KEY);
    req.user = { userId: payload.user_id, name: payload.full_name };
    next();
  } catch (error) {
    next(error);
  }
}

export default authenicationMiddleware;
