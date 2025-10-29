// oauthClient.js
import dotenv from "dotenv";
import KerliixOAuth from "kerliix-oauth";

dotenv.config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

// Validate required environment variables
if (!CLIENT_ID || !REDIRECT_URI) {
  throw new Error(
    "Missing required environment variables: CLIENT_ID, REDIRECT_URI"
  );
}

// Initialize the SDK
const oauthClient = new KerliixOAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET, // optional for public clients
  redirectUri: REDIRECT_URI,
  // baseUrl is optional now; defaults to http://localhost:4000
});

// --- Generate Authorization URL ---
export async function getAuthorizeUrl(state = "") {
  const { url, codeVerifier } = await oauthClient.getAuthUrl(
    ["openid", "profile", "email"],
    state,
    true // enable PKCE by default
  );
  return { url, codeVerifier };
}

// --- Exchange authorization code for tokens ---
export async function exchangeCodeForTokens(code, codeVerifier) {
  if (!code) throw new Error("Authorization code is required to exchange for tokens");

  try {
    const tokenResponse = await oauthClient.exchangeCodeForToken(code, codeVerifier);
    return tokenResponse;
  } catch (err) {
    console.error("Error exchanging code for tokens:", err.message || err);
    throw err;
  }
}

// --- Fetch user info ---
export async function fetchUserInfo(accessToken) {
  try {
    const userInfo = await oauthClient.getUserInfo(accessToken);
    return userInfo;
  } catch (err) {
    console.error("Error fetching user info:", err.message || err);
    throw err;
  }
}

// --- Refresh token if needed ---
export async function refreshTokenIfNeeded() {
  try {
    const token = await oauthClient.refreshTokenIfNeeded();
    return token;
  } catch (err) {
    console.error("Error refreshing token:", err.message || err);
    throw err;
  }
}

// --- Revoke token ---
export async function revokeToken(token) {
  if (!token) throw new Error("Token is required to revoke");

  try {
    const success = await oauthClient.revokeToken(token);
    return success;
  } catch (err) {
    console.error("Error revoking token:", err.message || err);
    throw err;
  }
}
