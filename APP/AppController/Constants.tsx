/* eslint-disable prettier/prettier */
import {Platform} from 'react-native';

export const DeviceiOS = Platform.OS === 'ios';

const testingURL = false;
export const getApiURL = () => {
  return 'http://13.68.134.198:81';
};
