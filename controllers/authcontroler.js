const User = require('../models/user'); // Capital U = model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashed });

    res.json({ msg: "User created successfully", user: newUser });

  } catch (err) {
    res.status(500).json({ msg: "Error in registration", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ msg: `Hello, ${user.username}`, token });

  } catch (err) {
    res.status(500).json({ msg: "Error in login", error: err.message });
  }
};
