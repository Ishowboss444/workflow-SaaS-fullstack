import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function hasher(val) {
  return await bcrypt.hash(val, 10);
}
class Auth {
  constructor(req, res) {
    this.res = res;
    this.name = req.body.name;
    this.username = req.body.username;
    this.password = req.body.password;
  }
  async login() {
    try {
      const userExist = await prisma.user.findUnique({
        where: { username: this.username },
      });

      if (!userExist) {
        console.log('there is no account exist');

        return this.res
          .status(404)
          .json({ message: 'there is no account exist' });
      }

      const isMatch = await bcrypt.compare(
        this.password,
        userExist.passwordHash
      );

      if (!isMatch) {
        return this.res.status(401).json({ message: 'wrong password' });
      } else {
        const accessToken = jwt.sign(
          {
            id: userExist.id,
            username: userExist.username,
            name: userExist.name,
          },
          process.env.ACCESS_TOKEN_SECRET
        );

        this.res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });

        return this.res.status(200).json({
          status: 'success',
          data: {
            id: userExist.id,
            name: userExist.name,
            username: userExist.username,
            token: accessToken,
          },
        });
      }
    } catch (err) {
      return this.res.status(500).json({ message: 'something went wrong' });
    }
  }

  async signup() {
    try {
      const isExist = await prisma.user.findUnique({
        where: { username: this.username },
      });
      //if username is exist don't go further
      if (isExist) {
        return this.res.status(400).json({
          status: 'this username is already exist',
          data: {
            id: isExist.id,
            name: isExist.name,
            createdAt: isExist.createdAt,
          },
        });
      }
      //password hassing
      const hashedPassword = await hasher(this.password);
      //creating new user
      const newUser = await prisma.user.create({
        data: {
          name: this.name,
          username: this.username,
          passwordHash: hashedPassword,
        },
      });
      if (!newUser)
        return this.res.status(500).json({ message: 'mission faild' });
      return this.res.status(200).json({
        status: 'success',
        data: {
          name: newUser.name,
          username: newUser.username,
          id: newUser.id,
        },
      });
    } catch (err) {
      console.log(err);
      return this.res.status(500).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
  }
}

export { Auth };
