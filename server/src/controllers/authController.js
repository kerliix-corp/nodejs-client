import { exchangeCodeForTokens, getAuthorizeUrl } from '../services/oauthService.js';

export const login = (req, res) => {
  console.log('/login route called');
  const authorizeUrl = getAuthorizeUrl();

  // If token exists, redirect to /profile
  const token = req.cookies.access_token;
  if (token) {
    console.log('User already has access_token, redirecting to /profile');
    return res.json({ url: '/profile' }); // or redirect directly
  }

  console.log('No token found, sending login URL');
  // Return JSON with URL for frontend
  res.json({ url: authorizeUrl });
};

export const callback = async (req, res) => {
  console.log('/callback route called');
  const { code, error } = req.query;
  if (error) {
    console.log('Authorization error received:', error);
    return res.send(`Authorization error: ${error}`);
  }
  if (!code) {
    console.log('Missing authorization code in query');
    return res.send('Missing authorization code');
  }

  console.log('Authorization code received:', code);

  try {
    const tokens = await exchangeCodeForTokens(code);
    console.log('Tokens received:', tokens);

    res.cookie('access_token', tokens.access_token, { httpOnly: true, secure: false });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure: false });
    console.log('Cookies set, redirecting to /profile');

    res.redirect('/profile');
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    res.send('Token exchange failed.');
  }
};

export const logout = (req, res) => {
  console.log('/logout route called, clearing cookies');
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.redirect('/');
};
