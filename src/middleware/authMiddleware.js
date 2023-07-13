const jwt = require('jsonwebtoken');

const secretKey = 'secret_key';

exports.authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);

    

    if (!decodedToken.adminId) {
      return res.status(403).json({ message: 'Authorization failed: Admin access required' });
    }

    req.adminId = decodedToken.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};
