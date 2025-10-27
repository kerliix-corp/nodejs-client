import app from './src/app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Example client running on http://localhost:${PORT}`);
});
