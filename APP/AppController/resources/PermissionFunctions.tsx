/* eslint-disable prettier/prettier */
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import {check, Permission, PERMISSIONS, request, RESULTS} from 'react-native-permissions';


export const permissionStorage = async (): Promise<Boolean> => {
  if (Platform.OS === 'ios') {
    return iOSonPermissions(PERMISSIONS.IOS.PHOTO_LIBRARY);
  }
  return onPermissionRequest(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
};

const onPermissionRequest = async (permission: any): Promise<Boolean> => {
  const granted = await PermissionsAndroid.check(permission);
  if (granted) {
    return true;
  }
  const status = await PermissionsAndroid.request(permission);
  console.log('permiso request ', status);
  return status === 'granted';
};

const iOSonPermissions = (permiso: Permission): Promise<Boolean> => {
  return check(permiso).then(result => {
    console.log('resultado >: ', result);
    if (RESULTS.GRANTED === result || result === RESULTS.LIMITED) {
      return true;
    }
    return request(permiso).then(resultSet => {
      console.log('resulSet ', resultSet);
      return RESULTS.GRANTED === resultSet || resultSet === RESULTS.LIMITED;
    });
  });
};
