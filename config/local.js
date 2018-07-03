module.exports.Config = {



    db: {
        ssl:false,
        user: 'postgres',
        host: 'localhost',
        database: 'choto',
        password: '1234',
        port: 5432,
        url: process.env.DATABASE_URL
    }


}