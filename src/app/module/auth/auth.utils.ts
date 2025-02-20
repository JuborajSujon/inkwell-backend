import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
) => {
  return jwt.sign(jwtPayload, secret.trim(), {
    expiresIn: '365d',
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
