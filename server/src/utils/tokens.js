import jwt from "jsonwebtoken";

async function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}
export default generateToken;
