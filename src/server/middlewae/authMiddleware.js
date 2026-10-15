import jwt from 'jsonwebtoken';

function authonticated(req, res, next) {
  let token = req.cookies.accessToken;
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'user is not authonticated' });
  }

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'invalid or expired token' });
  }
}
export default authonticated;
