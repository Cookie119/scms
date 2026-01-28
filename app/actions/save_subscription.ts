// import { pool } from "@/app/backend/db";

// await pool.query(
//   `
//   INSERT INTO push_subscriptions (user_id, subscription)
//   VALUES ($1, $2)
//   ON CONFLICT (user_id)
//   DO UPDATE SET subscription = EXCLUDED.subscription
//   `,
//   [userId, subscription]
// );
