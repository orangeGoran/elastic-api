require("dotenv").config();

module.exports = {
    development: {
        url: process.env.DEV_DATABASE_URL,
        dialect: "postgres",
        username: "postgres",
        password: "12qw34er",
        database: "postgres",
        port: "5555",
        logging: false,
    },
    test: {
        url: process.env.DEV_DATABASE_URL,
        dialect: "postgres",
        username: "postgres",
        password: "12qw34er",
        database: "postgres",
        port: "5555",
        logging: false,
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: "postgres",
        username: "postgres",
        password: "12qw34er",
        database: "postgres",
        port: "5555",
        logging: false,
    },
};
