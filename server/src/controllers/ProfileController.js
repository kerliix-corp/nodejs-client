import { fetchUserInfo } from '../services/oauthService.js';

export const getProfile = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.redirect('/');

  try {
    const user = await fetchUserInfo(token);
    res.send(`
      <h1>👤 User Profile</h1>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Email Verified:</strong> ${user.email_verified}</p>
      <pre>${JSON.stringify(user, null, 2)}</pre>
      <a href="/">Home</a> | <a href="/logout">Logout</a>
    `);
  } catch (err) {
    console.error('Failed to fetch user profile:', err.response?.data || err.message);
    res.clearCookie('access_token');
    res.redirect('/');
  }
};

export const userInfoRedirect = (req, res) => {
  res.redirect('/profile');
};
