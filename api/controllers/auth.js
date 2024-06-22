// controllers/auth.js
import bcrypt from "bcrypt"
import User from  "../models/User.js"

// Hàm để đăng ký người dùng mới
export async function registerUser(req, res) {
  const { username, password, acls } = req.body;
  try {
    const newUser = new User({
        username,
        password,
        acls
    });
    console.log(req.body)
    const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                message: "It seems you already have an account, please log in instead.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        res.status(200).json({
            status: "success",
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}

// Hàm để xác thực người dùng với username và password
export async function Login(req, res) {
    // Get variables for the login process
    const { username } = req.body;
    console.log(req.body)
    try {
        // Check if user exists
        const user = await User.findOne({ username }).select("+password");
        if (!user)
            return res.status(401).json({
                ok: false,
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // if user exists
        // validate password
        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // if not valid, return unathorized response
        if (!isPasswordValid)
            return res.status(401).json({
                ok: false,
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        const { password, ...user_data } = user._doc;

        res.status(200).json({
            ok: true,
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    console.log(req.body)
    res.end();
}

// Hàm để xác thực acls với đúng topic và acc của topic đó
export async function checkACL(req, res) {
  const { username, topic, acc } = req.body;
  console.log(req.body)
  try {
    const user = await User.findOne({
      username: username,
      acls: { $elemMatch: { topic: topic, acc: acc } }
    });

    if (user) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(403).json({ ok: false });
    }
  } catch (error) {
    console.error('Error checking ACL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log(req.body)
};
