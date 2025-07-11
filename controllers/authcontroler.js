const User = require('../models/user'); // Capital U = model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const refreshTokens=[]

const generateAccessToken=(user)=>{
  return jwt.sign(
    {id: user._id, username: user.username},
    process.env.JWT_SECRET,
    {expiresIn:'15m'}
  )
}


const generateRefreshToken=(user)=>{
const refreshToken=jwt.sign(
{id: user._id, username: user.username},
process.env.JWT_REFRESH_SECRET,
{expiresIn:'7d'}

)
refreshTokens.push(refreshToken)
return refreshToken
}






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




const accessToken=generateAccessToken(user)
const refreshToken=generateRefreshToken(user)
res.json({ 
  msg: `Hello, ${user.username}`, 
  accessToken, 
  refreshToken 
});
  

   

  } catch (err) {
    res.status(500).json({ msg: "Error in login", error: err.message });
  }
};






exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: 'Refresh token required' });

  if (!refreshTokens.includes(token)) return res.status(403).json({ msg: 'Invalid refresh token' });
console.log("Trying to refresh with token:", token);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Token expired or invalid' });

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
};
