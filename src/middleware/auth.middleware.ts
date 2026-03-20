import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken'

export const authenticateKey = async (req : Request, res : Response, next : NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({'message' : 'Unauthorized: API key is missing'});
    }
    next();
};

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
      const authHeader = req.headers?.authorization;
      const tokenFromBearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
      const tokenFromAltHeader = req.headers['x-access-token'];
      const tokenFromAlt = typeof tokenFromAltHeader === 'string' ? tokenFromAltHeader : undefined;
      const token = tokenFromBearer ?? tokenFromAlt;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: provide Authorization: Bearer <token>' });
      }

      const secret = process.env.JWT_SECRET || "not very secret";

      try {
        const payload = jwtVerify(token, secret);
        res.locals.payload = payload;
        return next();
      } catch (_err) {
        return res.status(401).json({ message: 'Unauthorized: token is invalid or expired' });
      }
    };

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = res.locals?.payload?.role;

  if (role && role === 'admin') {
    next();
    return;
  }

  return res.status(403).json({ message: 'Not authorised' });
};
