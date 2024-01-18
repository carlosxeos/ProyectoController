/* eslint-disable prettier/prettier */
import { createConnection, getConnection } from 'typeorm-react-native';
import { Session } from '../objects/session';
export class ConnectDB {
    async checkConnection() {
        try {
            return getConnection('default');
        } catch (error) {
            console.log('Error ==> ', error);
            return this.initDB();
        }
    }

    async initDB() {
        return createConnection({
            type: 'react-native',
            database: 'app-controller.sqlite',
            location: 'default',
            logging: ['error' /*'query'*/],
            synchronize: true,
            entities: [
                Session,
            ],
        });
    }
}
