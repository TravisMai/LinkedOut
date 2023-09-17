import * as dotenv from 'dotenv';

dotenv.config({ path: '.development.env' });

export default {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
};