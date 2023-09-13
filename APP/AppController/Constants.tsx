/* eslint-disable prettier/prettier */
import {Platform} from 'react-native';

export const DeviceiOS = Platform.OS === 'ios';

const testingURL = false;
export const getApiURL = () => {
  return '';//'http://13.68.134.198:81';
};

export const wsEvents = Object.freeze({
  door: 'gfr',
});

export const mqttEvents = Object.freeze({
  get: {
    door: 'get/door',
  },
  set: {
    door: 'set/door',
  },
});
