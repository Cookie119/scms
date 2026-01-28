// "use server";

// import { pool } from "@/app/backend/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// export async function addComplaint(formData: FormData) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     throw new Error("Unauthorized");
//   }

//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const category_id = Number(formData.get("category_id"));
// const priority = formData.get("priority") as string;
// // const priority = formData.get("priority_request") as string;


// if (!["low", "medium", "high"].includes(priority)) {
//   throw new Error("Invalid priority");
// }


// await pool.query(
//   `
//   INSERT INTO complaints
//     (user_id, category_id, title, description, priority_request)
//   VALUES
//     ($1, $2, $3, $4, $5)
//   `,
//   [
//     session.user.id,
//     category_id,
//     title,
//     description,
//     priority,
//   ]
// );
// }


"use server";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { pool } from "@/app/backend/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function addComplaint(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user_id = Number(session.user.id);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category_id = Number(formData.get("category_id"));
  const priority = formData.get("priority") as string;

  if (!["low", "medium", "high"].includes(priority)) {
    throw new Error("Invalid priority");
  }

  // 🔹 IMAGE HANDLING (DEV)
  const files = formData.getAll("images") as File[];
  const imagePaths: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${uuid()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    imagePaths.push(`/uploads/${fileName}`); // 👈 store path only
  }

  // 🔹 INSERT
  await pool.query(
    `
    INSERT INTO complaints
      (user_id, category_id, title, description, priority_request, images)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    `,
    [
      user_id,
      category_id,
      title,
      description,
      priority,
      imagePaths,
    ]
  );
   redirect('/dashboard/user');
}

