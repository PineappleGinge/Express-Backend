import { Request, Response } from 'express';
import { collections } from '../database';
import { Role, User } from '../models/user'
import * as argon2 from 'argon2';
import { sign as jwtSig } from 'jsonwebtoken';

const DEFAULT_ADMIN_EMAIL = 'joe99@gmail.com';

const createAccessToken = (user: User | null): string => {

  const secret = process.env.JWT_SECRET || "not very secret";

  const expiresTime = '2h';
  const normalizedTokenEmail = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
  const tokenRole = normalizedTokenEmail === DEFAULT_ADMIN_EMAIL ? Role.admin : user?.role;

  console.log(expiresTime);
  const payload: Object =
  {
    email: user?.email,
    name: user?.name,
    role: tokenRole
  }
  const token = jwtSig(payload, secret, { expiresIn: expiresTime });

  return token;
}

export const handleLogin = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const dummyHash = await argon2.hash("time wasting");
  const normalizedEmailInput = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const normalizedPasswordInput = typeof password === 'string' ? password.trim() : '';

  if (!normalizedEmailInput || !normalizedPasswordInput) {
    res
      .status(400)
      .json({ message: 'Email and password are required' });
    return;
  }
  const normalizedEmail = normalizedEmailInput;
  let user = await collections.users?.findOne({
    email: normalizedEmail,
  }) as unknown as User;

  if (!user && normalizedEmail === DEFAULT_ADMIN_EMAIL) {
    const hashedPassword = await argon2.hash(normalizedPasswordInput);
    const bootstrapAdmin: Partial<User> = {
      email: normalizedEmail,
      name: 'Joe Admin',
      phonenumber: '0000000000',
      role: Role.admin,
      hashedPassword,
      dateJoined: new Date(),
      lastUpdated: new Date(),
    };
    await collections.users?.insertOne(bootstrapAdmin as User);
    user = await collections.users?.findOne({ email: normalizedEmail }) as unknown as User;
  }

  if (user) {
    let isPasswordValid = false;
    let shouldMigrateLegacyPassword = false;

    if (user.hashedPassword) {
      isPasswordValid = await argon2.verify(user.hashedPassword, normalizedPasswordInput);
    } else if (typeof user.password === 'string') {
      // Backward compatibility for legacy records that still store plain passwords.
      isPasswordValid = user.password === normalizedPasswordInput;
      shouldMigrateLegacyPassword = isPasswordValid;
    }

    if (isPasswordValid) {
      const userForToken = { ...user };
      const updateSet: Record<string, unknown> = { lastUpdated: new Date() };
      const updateUnset: Record<string, ''> = {};

      if (normalizedEmail === DEFAULT_ADMIN_EMAIL && userForToken.role !== Role.admin) {
        userForToken.role = Role.admin;
        updateSet.role = Role.admin;
      }

      if (shouldMigrateLegacyPassword) {
        const newHashedPassword = await argon2.hash(normalizedPasswordInput);
        userForToken.hashedPassword = newHashedPassword;
        updateSet.hashedPassword = newHashedPassword;
        updateUnset.password = '';
      }

      if (Object.keys(updateSet).length > 0 || Object.keys(updateUnset).length > 0) {
        await collections.users?.updateOne(
          { email: normalizedEmail },
          {
            ...(Object.keys(updateSet).length > 0 ? { $set: updateSet } : {}),
            ...(Object.keys(updateUnset).length > 0 ? { $unset: updateUnset } : {}),
          }
        );
      }

      res.status(201).json({ accessToken: createAccessToken(userForToken) });
      return;
    }

    res.status(401).json({
      message: 'Invalid email or password!'
    });
    return;
  }

  // if here the user was not found or there was no hashedpassword.
  // the code below is so that the time taken will be roughly the same if the
  // password is incorrect or if the user does not exist.

  await argon2.verify(dummyHash, normalizedPasswordInput, );
  res.status(401).json({
    message: 'Invalid email or password!'
  });

}
