import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretgowingskey';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string; role: string; } & jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string; } & jwt.JwtPayload;
};
