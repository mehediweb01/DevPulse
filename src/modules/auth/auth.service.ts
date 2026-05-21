import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import { userRole, type IUser } from "./auth.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (role && !userRole.includes(role)) {
    throw new Error(`Invalid role`);
  }

  const hashed = await bcrypt.hash(password, 8);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role) VALUES($1,$2,$3,COALESCE($4, 'contributor')) RETURNING *  
    `,
    [name, email, hashed, role],
  );

  delete result.rows[0].password;

  return result;
};

const userLoginIntoDB = async (payload: Omit<IUser, "name" | "role">) => {
  const { email, password } = payload;

  const allowedKeys = ["email", "password"];

  const invalidFields = Object.keys(payload).filter(
    (key) => !allowedKeys.includes(key),
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid Fields: ${invalidFields.join(",")}`);
  }

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
  `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = userData.rows[0];

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw new Error("Invalid credentials!");
  }

  const jwt_payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const access_token = jwt.sign(jwt_payload, config.secret as string, {
    expiresIn: "1d",
  });

  return {
    user,
    access_token,
  };
};

export const authService = {
  createUserIntoDB,
  userLoginIntoDB,
};
