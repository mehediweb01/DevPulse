import bcrypt from "bcryptjs";
import { pool } from "../../db";
import { userRole, type IUser } from "./auth.interface";

const createUserIntoDB = async (payload: IUser) => {
  try {
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
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Internal server error",
    );
  }
};

export const authService = {
  createUserIntoDB,
};
