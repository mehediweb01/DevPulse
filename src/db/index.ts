import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(15) NOT NULL DEFAULT 'contributor',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )    
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT CHECK(LENGTH(description) >= 20),
            type VARCHAR(16) NOT NULL,
            status VARCHAR(14) NOT NULL DEFAULT 'open',
            reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )    
    `);

    console.log(`Database connected successful!`);
  } catch (error) {
    console.error(error);
  }
};

export { initDB, pool };
