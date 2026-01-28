// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { Pool } from "pg";

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "root",
//   database: "test2",
//   port: 5432,
// });

// const handler = NextAuth({
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const res = await pool.query(
//           "SELECT id, email, password, role FROM users WHERE email = $1",
//           [credentials.email]
//         );

//         const user = res.rows[0];
//         if (!user) return null;

//         const match = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!match) return null;

//         return {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) token.role = user.role;
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { Pool } from "pg";

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "root",
//   database: "test2",
//   port: 5432,
// });

// const handler = NextAuth({
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const res = await pool.query(
//           `SELECT 
//              u.id,
//              u.email,
//              u.password,
//              r.role_name
//            FROM users u
//            JOIN roles r ON r.role_id = u.role_id
//            WHERE u.email = $1`,
//           [credentials.email]
//         );

//         const user = res.rows[0];
//         if (!user) return null;

//         const match = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!match) return null;

//         return {
//           id: user.id,
//           email: user.email,
//           role: user.role_name, // 👈 VERY IMPORTANT
//         };
//       },
//     }),
//   ],
  
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };


import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {pool} from "@/app/backend/db"
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await pool.query(
          `SELECT 
             u.id,
             u.email,
             u.password,
             r.role_name
           FROM users u
           JOIN roles r ON r.role_id = u.role_id
           WHERE u.email = $1`,
          [credentials.email]
        );

        const user = res.rows[0];
        if (!user) return null;

        const match = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!match) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role_name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
