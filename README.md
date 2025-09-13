# Azure AD Authentication Test with Allowlist

This is a minimal Next.js application that demonstrates Azure AD authentication with an email allowlist using Auth.js (NextAuth.js).

## Setup Instructions

### 1. Azure AD Configuration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Configure your app:
   - Name: `Authentication Test App` (or your preferred name)
   - Supported account types: Select based on your needs
   - Redirect URI:
     - Platform: Web
     - URL: `https://YOUR-APP-NAME.azurestaticapps.net/api/auth/callback/azure-ad` (for production)
     - Also add: `http://localhost:3000/api/auth/callback/azure-ad` (for local development)
5. After creation, note down:
   - Application (client) ID
   - Directory (tenant) ID
6. Go to "Certificates & secrets" > "Client secrets" > "New client secret"
7. Create a secret and note down the value (you won't be able to see it again)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Auth.js Configuration
NEXTAUTH_URL=https://YOUR-APP-NAME.azurestaticapps.net  # For production
# NEXTAUTH_URL=http://localhost:3000  # For local development
NEXTAUTH_SECRET=generate-a-secret-with-openssl-rand-base64-32

# Azure AD Configuration
AZURE_AD_CLIENT_ID=your-application-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret-value
AZURE_AD_TENANT_ID=your-directory-tenant-id
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

### 3. Azure Static Web Apps Configuration

When deploying to Azure Static Web Apps, add these environment variables in the Azure Portal:
1. Go to your Static Web App resource
2. Navigate to Configuration > Application settings
3. Add all the environment variables from your `.env.local` file

### 4. Update Allowlist

Edit the `allowedEmails` array in `pages/api/auth/[...nextauth].ts`:

```typescript
const allowedEmails = ['iwahbi@slb.com', 'trustedcolleague@slb.com']
```

Add the email addresses that should be allowed to sign in.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Deployment

The app is configured to work with Azure Static Web Apps. Push to your GitHub repository and Azure will automatically build and deploy.

## How It Works

1. User clicks "Sign In"
2. Redirected to Microsoft login
3. After successful Microsoft authentication, the app checks if the user's email is in the allowlist
4. If email is allowed → user is signed in
5. If email is NOT allowed → authentication is blocked with an error message

## Troubleshooting

### 404 Error on Sign In
- Ensure NEXTAUTH_URL matches your deployment URL exactly
- Verify redirect URIs are configured correctly in Azure AD app registration
- Check that all environment variables are set in Azure Static Web Apps configuration

### Access Denied Error
- User's email is not in the allowlist
- Add the email to `allowedEmails` array and redeploy

### Configuration Error
- Check all environment variables are set correctly
- Verify Azure AD app credentials are correct
- Ensure NEXTAUTH_SECRET is set