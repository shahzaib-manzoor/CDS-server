import jwt from "jsonwebtoken";

export async function generateToken(data: any, expiresIn: string = "24h") {
  // Get the secret key directly without template literals
  const secret = process.env.CLIENT_SECRET;

  // Check if secret exists
  if (!secret) {
    throw new Error("CLIENT_SECRET environment variable is not defined");
  }

  const token = jwt.sign(
    {
      data: data,
    },
    secret
  );

  return token;
}

export async function verifyToken(token: string) {
  const secret = process.env.CLIENT_SECRET;

  if (!secret) {
    throw new Error("CLIENT_SECRET environment variable is not defined");
  }

  const decoded = jwt.verify(token, secret);
  return decoded;
}
