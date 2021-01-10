import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import 'dotenv-safe/config';
import Redis from 'ioredis';
import 'colors';

const main = async () =>
{
    const redis = new Redis( {
        host: process.env.REDIS_URL
    } );

    await redis.lpush( 'ok', 1 );
    const res = await redis.lrange( 'ok', 0, -1 );
    console.log( 'res = ', res );

    await createConnection( {
        type: 'postgres',
        url: process.env.DB_URL,
        synchronize: true,
        logging: true
    } );

    console.log( 'Postgres is here'.blue.bold );

    const app = express();

    app.get( '/', ( _: Request, res: Response ) =>
    {
        res.send( 'API up and runnin' );
        res.end();
    } );

    const PORT = +process.env.PORT;
    app.listen( PORT, () =>
    {
        console.log( `Server started on port ${ PORT }`.green.bold );
    } );

};

main().catch( err => console.error( err ) );