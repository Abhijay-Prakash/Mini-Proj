    import { Sequelize, Op } from 'sequelize';
    import dotenv from 'dotenv';
    dotenv.config();

    const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
        host: process.env.PG_HOST,
        dialect: 'postgres',
        port: process.env.PG_PORT,
        logging: false, // Disable logging (optional)
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    });

    export default sequelize;