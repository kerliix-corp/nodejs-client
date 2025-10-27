import dotenv from "dotenv";
import KerliixOAuth from "kerliix-oauth";

dotenv.config();

const { CLIENT_ID, CLIENT_SECRET, OAUTH_SERVER_URL, REDIRECT_URI } = process.env;

console.log("Loading environment variables...");
console.log("CLIENT_ID:", CLIENT_ID);
console.log("OAUTH_SERVER_URL:", OAUTH_SERVER_URL);
console.log("REDIRECT_URI:", REDIRECT_URI);

// Initialize the SDK
console.log("Initializing KerliixOAuth client...");
const oauthClient = new KerliixOAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  baseUrl: OAUTH_SERVER_URL,
});
console.log("OAuth client initialized");

// Get the authorization URL
export const getAuthorizeUrl = (state = "") => {
  console.log("Generating authorization URL with state:", state);
  const url = oauthClient.getAuthUrl(["openid", "profile", "email"], state);
  console.log("Authorization URL generated:", url);
  return url;
};

// Exchange code for token
export const exchangeCodeForTokens = async (code) => {
  console.log("Exchanging code for tokens. Code:", code);
  try {
    const tokenResponse = await oauthClient.exchangeCodeForToken(code);
    console.log("Tokens received:", tokenResponse);
    return tokenResponse;
  } catch (err) {
    console.error("Error exchanging code for tokens:", err.message || err);
    throw err;
  }
};

// Fetch user info
export const fetchUserInfo = async (accessToken) => {
  console.log("Fetching user info with access token:", accessToken);
  try {
    const userInfo = await oauthClient.getUserInfo(accessToken);
    console.log("User info received:", userInfo);
    return userInfo;
  } catch (err) {
    console.error("Error fetching user info:", err.message || err);
    throw err;
  }
};

// Refresh token if needed
export const refreshTokenIfNeeded = async () => {
  console.log("Checking if token refresh is needed...");
  try {
    const token = await oauthClient.refreshTokenIfNeeded();
    console.log("Token refreshed (or still valid):", token);
    return token;
  } catch (err) {
    console.error("Error refreshing token:", err.message || err);
    throw err;
  }
};

// Revoke token
export const revokeToken = async (token) => {
  console.log("🔹 Revoking token:", token);
  try {
    const success = await oauthClient.revokeToken(token);
    console.log("Token revoked successfully:", success);
    return success;
  } catch (err) {
    console.error("Error revoking token:", err.message || err);
    throw err;
  }
};
