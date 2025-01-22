/* eslint-disable prettier/prettier */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Platform } from 'react-native';
import { colores } from './resources/globalStyles';
import moment from 'moment';

export const DeviceiOS = Platform.OS === 'ios';
export const tokenKey = 'tokenUser';
export const timeWaitSeconds = 35; // tiempo de espera para coldown en segundos

// tiempo de espera cuando pulsamos el boton de abrir/cerrar fuera de horario en segundos
export const timeWaitUnauthorized = 60; // 10 min (600)
export const keyStorage = {
  user: 'username',
};
export const appVersion = '2.2';
export const testingURL = true; // si esta en true, apunta a localhost
const ipAddressConfigRemote = testingURL ?
  '192.168.1.18' // ip local
  : '1'//'13.68.134.198'; // ip del servidor de omar
export const getApiURL = () => {
  return `http://${ipAddressConfigRemote}:3001/api/`;
};

export const getWsURL = () => {
  return `http://${ipAddressConfigRemote}:81`;
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
    error: 'Ingrese un número de teléfono válido', minLength: 5,
  },
  {
    id: 4, hint: 'Nombre de usuario',
    maxLength: 13, type: 'input',
    error: 'Ingrese un nombre de usuario', minLength: 5,
    autocomplete: 'off',
  },
  {
    id: 5, hint: 'Contraseña',
    maxLength: 20, type: 'input', icon: 'account-key',
    error: 'La contraseña es inválida', minLength: 6, password: true,
    regex: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    autocomplete: 'off',
  },
  {
    id: 6, hint: 'Confirmar contraseña',
    maxLength: 20, type: 'input', icon: 'account-key',
    error: 'La contraseña no coincide', minLength: 6, password: true,
    regex: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    autocomplete: 'off',
  },
  //{ TODO: a futuro para implementacion de tipos de usuario, mientras va a ser todos de tipo usuario
  //  id: 7, hint: 'Tipo de usuario',
  //  maxLength: 13, type: 'input',
  //  error: 'Seleccione un tipo de usuario', minLength: 20, password: true,
  //  autocomplete: 'off',
  //  visibleSi: false,
  //},
];

export const getDateFormatLocal = (date: string) => {
  return moment(date).utc().format('DD/MM/YY hh:mm:ss A');
};
//

