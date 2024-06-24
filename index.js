import { PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_COLLECTION } from "./api/config/index.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { registerUser, Login, checkACL } from "./api/controllers/auth.js";
import { monitor } from './monitor.js';
const app = express();

// Ket noi mongodb
const URI = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_COLLECTION}?authSource=admin`
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.json());

// Route dang ki
app.post('/api/regis', registerUser);

// route authen
app.post('/api/auth', Login);

// Route check acls
app.post('/api/acl', checkACL);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  monitor();
});