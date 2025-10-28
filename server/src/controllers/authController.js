// controllers/authController.js
import {
  getAuthorizeUrl,
  exchangeCodeForTokens,
  fetchUserInfo,
  revokeToken,
} from "../services/oauthService.js";

let currentSession = {
  codeVerifier: null,
  accessToken: null,
  refreshToken: null,
  userInfo: null,
};

// --- Redirect to OAuth login ---
export async function login(req, res) {
  try {
    const state = crypto.randomUUID(); // Optional CSRF prevention
    const { url, codeVerifier } = await getAuthorizeUrl(state);
    currentSession.codeVerifier = codeVerifier;
    currentSession.state = state;

    return res.redirect(url);
  } catch (err) {
    console.error("Error initiating login:", err.message || err);
    return res.status(500).send("Failed to start OAuth flow.");
  }
}

// --- OAuth callback ---
export async function callback(req, res) {
  const { code, state, error } = req.query;

  if (error) {
    console.error("OAuth error:", error);
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  if (!code) {
    console.error("Missing authorization code.");
    return res.status(400).send("Missing authorization code.");
  }

  try {
    const tokenResponse = await exchangeCodeForTokens(
      code,
      currentSession.codeVerifier
    );

    currentSession.accessToken = tokenResponse.access_token;
    currentSession.refreshToken = tokenResponse.refresh_token;

    const userInfo = await fetchUserInfo(currentSession.accessToken);
    currentSession.userInfo = userInfo;

    // You can render a view or redirect to your frontend
    return res.json({
      message: "Login successful!",
      user: userInfo,
      tokens: tokenResponse,
    });
  } catch (err) {
    console.error("Error during OAuth callback:", err.message || err);
    return res.status(500).send("OAuth callback failed.");
  }
}

// --- Logout and revoke token ---
export async function logout(req, res) {
  try {
    if (!currentSession.accessToken) {
      console.warn("No active session token found.");
      return res.status(200).send("Already logged out.");
    }

    await revokeToken(currentSession.accessToken);

    // Clear the in-memory session
    currentSession = {
      codeVerifier: null,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    };

    return res.status(200).send("Logged out successfully.");
  } catch (err) {
    console.error("Error during logout:", err.message || err);
    return res.status(500).send("Logout failed.");
  }
}
