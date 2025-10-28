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

console.log("Loading environment variables...");
console.log("CLIENT_ID:", CLIENT_ID);
console.log("REDIRECT_URI:", REDIRECT_URI);
console.log(
  "OAUTH_SERVER_URL: Using default SDK URL (http://localhost:4000) if not specified"
);

// Initialize the SDK
console.log("Initializing KerliixOAuth client...");
const oauthClient = new KerliixOAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET, // optional for public clients
  redirectUri: REDIRECT_URI,
  // baseUrl is optional now; defaults to http://localhost:4000
});
console.log("OAuth client initialized");

// --- Generate Authorization URL ---
export async function getAuthorizeUrl(state = "") {
  console.log("Generating authorization URL with state:", state);
  const { url, codeVerifier } = await oauthClient.getAuthUrl(
    ["openid", "profile", "email"],
    state,
    true // enable PKCE by default
  );
  console.log("Authorization URL generated:", url);
  return { url, codeVerifier };
}

// --- Exchange authorization code for tokens ---
export async function exchangeCodeForTokens(code, codeVerifier) {
  if (!code) throw new Error("Authorization code is required to exchange for tokens");

  console.log("Exchanging code for tokens. Code:", code);
  try {
    const tokenResponse = await oauthClient.exchangeCodeForToken(code, codeVerifier);
    console.log("Tokens received:", tokenResponse);
    return tokenResponse;
  } catch (err) {
    console.error("Error exchanging code for tokens:", err.message || err);
    throw err;
  }
}

// --- Fetch user info ---
export async function fetchUserInfo(accessToken) {
  console.log("Fetching user info with access token:", accessToken);
  try {
    const userInfo = await oauthClient.getUserInfo(accessToken);
    console.log("User info received:", userInfo);
    return userInfo;
  } catch (err) {
    console.error("Error fetching user info:", err.message || err);
    throw err;
  }
}

// --- Refresh token if needed ---
export async function refreshTokenIfNeeded() {
  console.log("Checking if token refresh is needed...");
  try {
    const token = await oauthClient.refreshTokenIfNeeded();
    console.log("Token refreshed (or still valid):", token);
    return token;
  } catch (err) {
    console.error("Error refreshing token:", err.message || err);
    throw err;
  }
}

// --- Revoke token ---
export async function revokeToken(token) {
  if (!token) throw new Error("Token is required to revoke");

  console.log("🔹 Revoking token:", token);
  try {
    const success = await oauthClient.revokeToken(token);
    console.log("Token revoked successfully:", success);
    return success;
  } catch (err) {
    console.error("Error revoking token:", err.message || err);
    throw err;
  }
}
