import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import config from '../config';
import { ConstantsEnum } from '../util/Constantes.enum';
@Global()
@Module({
    providers: [
        {
            provide: ConstantsEnum.provideConnection,
            useFactory: (configService: ConfigType<typeof config>) => {
                
              const { user, host, db_name, password, port } = configService.database;
              const client = mysql.createPool({
                user,
                host,
                database: db_name,
                password,
                waitForConnections: true,
                connectionLimit: 10,
                idleTimeout: 60000,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
                port,
              });
              return client;
            },
            inject: [config.KEY],
          },
    ],
    exports: [ConstantsEnum.provideConnection ],
})
export class DatabaseModule {}
