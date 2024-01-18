/* eslint-disable prettier/prettier */
import * as io from 'socket.io-client';
import {getWsURL} from '../Constants';
const socketClient = io.connect(getWsURL(), {
    autoConnect: true,
});
export default socketClient;
