import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import Redis from 'ioredis';
import 'colors';

const main = async () =>
{
    const redis = new Redis( {
        host: process.env.REDIS_HOST,
        port: 6379
    } );

    await redis.lpush( 'ok', 1 );
    const res = await redis.lrange( 'ok', 0, -1 );
    console.log( 'res = ', res );

    let retries = 20;
    while ( retries )
    {
        try
        {
            await createConnection( {
                type: 'postgres',
                database: 'test',
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                logging: true,
                synchronize: true,
                host: process.env.DB_HOST,
            } );
            console.log( 'Postgres is here'.blue.bold );
            break;
        } catch ( err )
        {
            console.log( 'inside typeorm...' );
            console.error( err );
            retries -= 1;
            console.log( 'retries left = ', retries );
            await new Promise( res => setTimeout( res, 5000 ) );
        }
    }

    const app = express();

    app.get( '/', ( _: Request, res: Response ) =>
    {
        res.send( 'API up and runnin' );
        res.end();
    } );

    const PORT = Number( process.env.PORT ) || 5000;
    app.listen( PORT, () =>
    {
        console.log( `Server started on port ${ PORT }`.green.bold );
    } );

};

main().catch( err => console.error( err ) );