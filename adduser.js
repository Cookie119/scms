import bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "test2",
  port: 5432,
});

async function addUser(email, password, role_id) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (email, password, role_id)
     VALUES ($1, $2, $3)`,
    [email, hashedPassword, role_id]
  );

  console.log("User added:", email);
}

// Examples
addUser("security@example.com", "12345", 5);
addUser("security1@example.com", "12345", 5);
// addUser("user1@example.com", "user123", 3);
// addUser("user2@example.com", "user123", 3);
// addUser("admin@example.com", "admin123", 1);
// addUser("staff@example.com", "staff123", 2);
// addUser("plumber@flat.com", "plumber123", 4);
// addUser("electrician@flat.com", "electric123", 4);
