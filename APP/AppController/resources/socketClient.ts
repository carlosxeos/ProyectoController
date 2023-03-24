import * as io from 'socket.io-client';
import {getApiURL} from '../Constants';
const socketClient = io.connect(getApiURL());
export default socketClient;
