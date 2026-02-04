import jwt from 'jsonwebtoken';


export const generateToken = (userId, res) => {
  // Function to generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent xss attacks cross-site scripting attacks 
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV !== "development", // set to true in production 
  });
    return token;
}