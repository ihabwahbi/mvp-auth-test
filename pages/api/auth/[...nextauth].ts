import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

const allowedEmails = ['iwahbi@slb.com', 'trustedcolleague@slb.com']

const isDevelopment = process.env.NODE_ENV === 'development'

export const authOptions: NextAuthOptions = {
  providers: isDevelopment ? [
    // Development-only mock provider
    CredentialsProvider({
      id: 'mock-credentials',
      name: 'Mock Login (Dev Only)',
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter an allowed email"
        }
      },
      async authorize(credentials) {
        console.log('🔧 Development Mode: Using mock authentication provider')

        if (!credentials?.email) {
          console.log('❌ No email provided')
          return null
        }

        if (!allowedEmails.includes(credentials.email)) {
          console.log(`❌ Mock sign-in blocked for ${credentials.email} - not in allowlist`)
          return null
        }

        console.log(`✅ Mock sign-in allowed for ${credentials.email}`)

        // Return a mock user object that matches the structure from Azure AD
        return {
          id: `mock-${credentials.email}`,
          email: credentials.email,
          name: credentials.email.split('@')[0].replace('.', ' ').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '), // Convert email to a display name
          image: null
        }
      }
    })
  ] : [
    // Production Azure AD provider
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For development mode with credentials provider
      if (isDevelopment && account?.provider === 'mock-credentials') {
        // Authorization already happened in the authorize callback
        return true
      }

      // For production Azure AD
      if (user.email && allowedEmails.includes(user.email)) {
        console.log(`✅ Sign-in allowed for ${user.email}`)
        return true
      } else {
        console.log(`❌ Sign-in blocked for ${user.email || 'unknown'} - not in allowlist`)
        return false
      }
    },
    async session({ session, token }) {
      // Ensure consistent session structure across environments
      if (isDevelopment && session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
    async jwt({ token, account, profile, user }) {
      // For initial sign in
      if (user) {
        token.email = user.email
        token.name = user.name
      }

      // For Azure AD, preserve the access token
      if (account?.provider === 'azure-ad') {
        token.accessToken = account.access_token
      }

      return token
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: isDevelopment ? undefined : undefined, // Can customize sign-in page per environment if needed
    error: '/auth/error', // Optional: custom error page
  },
  debug: isDevelopment, // Enable debug logs in development
}

export default NextAuth(authOptions)