import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import type { NextAuthOptions } from "next-auth"

const allowedEmails = ['iwahbi@slb.com', 'trustedcolleague@slb.com']

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email && allowedEmails.includes(user.email)) {
        console.log(`Sign-in allowed for ${user.email}`)
        return true
      } else {
        console.log(`Sign-in blocked for ${user.email} - not in allowlist`)
        return false
      }
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)