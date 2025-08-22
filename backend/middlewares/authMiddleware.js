const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Move to .env in production

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains _id, email, role
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
