import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string): JwtPayload => {
  const decoded = jwt.verify(token as string, secret as string) as JwtPayload;

  return decoded;
};

export default verifyToken;
