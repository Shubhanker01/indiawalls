// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Owner Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const allowedEmail = process.env.ADMIN_EMAIL;
                const allowedHash = process.env.ADMIN_PASSWORD?.replace(/[\r\n]/g, "").replace(/^['"]|['"]$/g, "").trim();
                if (!allowedEmail || !allowedHash) return null;
                if (!credentials?.email || !credentials?.password) return null;

                // 1. Check email against allowlist
                if (credentials.email !== allowedEmail) {
                    return null;
                }

                // 2. Verify hashed password
                const isValidPassword = bcrypt.compareSync(
                    credentials.password,
                    allowedHash
                );
                console.log(isValidPassword)
                if (!isValidPassword) {
                    return null;
                }

                // 3. Return owner payload
                return {
                    id: "owner-1",
                    email: allowedEmail,
                    role: "ADMIN",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/", // Redirect unauthenticated users to /login
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };