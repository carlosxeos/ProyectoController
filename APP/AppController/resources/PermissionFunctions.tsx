/* eslint-disable prettier/prettier */
import { PermissionsAndroid } from 'react-native';
import { Platform } from 'react-native';
import { check, Permission, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

/**
 * Revisa si el celular tiene permisos de localización
 */
export const hasLocationPermission = async (): Promise<Boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await iosPermissionRequest(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }

    if (+Platform.Version < 23) {
      return true;
    }
    return androidPermissionRequest(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  } catch (error) {
    console.log('hasLocationPermission ', error);
  }
  return false;
};


const androidPermissionRequest = async (permission: any): Promise<Boolean> => {
  const granted = await PermissionsAndroid.check(permission);
  if (granted) {
    return true;
  }
  const status = await PermissionsAndroid.request(permission);
  console.log('permiso request ', status);
  return status === 'granted';
};

const iosPermissionRequest = (permiso: Permission): Promise<Boolean> => {
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
