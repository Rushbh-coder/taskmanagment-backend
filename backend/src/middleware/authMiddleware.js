const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization']; // or req.get('Authorization')
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Assuming 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ msg: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure this secret matches the one used during token generation
    req.user = { id: decoded.userId }; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
