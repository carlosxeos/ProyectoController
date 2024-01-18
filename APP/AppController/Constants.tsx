/* eslint-disable prettier/prettier */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Platform } from 'react-native';
import { colores } from './resources/globalStyles';

export const DeviceiOS = Platform.OS === 'ios';
export const tokenKey = 'tokenUser';
const testingURL = true;
export const getApiURL = () => {
  if (testingURL) {
    return 'http://192.168.1.10:3001/api/';
  }
  return '';
};

export const getWsURL = () => {
  return 'http://192.168.1.10:81';
  //'http://13.68.134.198:81 // no usar porque es productivo';
};

export const wsEvents = Object.freeze({
  get: {
    door: 'get/door',
  },
  set: {
    door: 'set/door',
  },
});



export const WorkerInputs = [ // 0 a 6
  {
    id: 0, hint: 'Llene los siguientes campos', type: 'title', icon: faUser, color: colores.Primary,
  },
  {
    id: 1, hint: 'Nombre',
    maxLength: 50, type: 'input',
    error: 'Ingrese un nombre válido', minLength: 3,
  },
  {
    id: 2, hint: 'Apellido',
    maxLength: 50, type: 'input',
    error: 'Ingrese un apellido válido', minLength: 3,
  },
  {
    id: 3, hint: 'Teléfono', icon: 'phone',
    maxLength: 13, type: 'input', inputType: 'number-pad',
    error: 'Ingrese un número de teléfono', minLength: 5,
  },
  {
    id: 4, hint: 'Nombre de usuario',
    maxLength: 13, type: 'input', icon: 'account-key',
    error: 'Ingrese un nombre de usuario', minLength: 5,
  },
  {
    id: 5, hint: '¿Es Administrador?', type: 'switch',
    child: [],
  },
];


//

