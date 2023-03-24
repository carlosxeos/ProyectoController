import {Platform} from 'react-native';

export const DeviceiOS = Platform.OS === 'ios';

const testingURL = false;
export const getApiURL = () => {
  return 'http://192.168.0.18:80';
};
