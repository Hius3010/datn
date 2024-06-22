// server.js
import { PORT, URI } from "./api/config/index.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { registerUser, Login, checkACL } from "./api/controllers/auth.js";
const app = express();

// Kết nối đến MongoDB
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.json());

// Route để đăng ký người dùng mới
app.post('/api/regis', registerUser);

// Route để xác thực người dùng với username và password
app.post('/api/auth', Login);

// Route để xác thực acls với đúng topic và acc của topic đó
app.post('/api/acl', checkACL);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});