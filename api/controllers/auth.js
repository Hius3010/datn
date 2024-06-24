import bcrypt from "bcrypt"
import User from  "../models/User.js"

// Dang ki nguoi dung moi
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

// Authen user
export async function Login(req, res) {
    const { username } = req.body;
    console.log(req.body)
    try {
        // Kiem tra nguoi dung ton tai
        const user = await User.findOne({ username }).select("+password");
        if (!user)
            return res.status(401).json({
                ok: false,
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        if (!isPasswordValid)
            return res.status(401).json({
                ok: false,
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        const { password, ...user_data } = user._doc;

        res.status(200).json({
            ok: true,
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
        });
    }
    console.log(req.body)
    res.end();
}

// Check acl func
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
