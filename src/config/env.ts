import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,

    auth: {
        jwt_secret: process.env.JWT_SECRET || 'jwt secret',
        password_secret: process.env.PASSWORD_SECRET || 'password secret',
        jwt_duration: '2m',
    },
};

export default config;
