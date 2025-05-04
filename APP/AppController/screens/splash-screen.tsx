/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native-elements';
import { appStyles, colores } from '../resources/globalStyles';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyStorage } from '../Constants';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

function SplashScreen({ navigation }) {
    async function checkBiometrics() {
        const usrName = await AsyncStorage.getItem(keyStorage.user) || '';
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
        rnBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject;
                // 0 es ninguna, 1 es face id, 2 es touch id y 3 biometrics
                let typeNumber = 0;
                if (available) {
                    if (biometryType === BiometryTypes.FaceID) {
                        console.log('FaceID is supported');
                        typeNumber = 1;
                    } else if (biometryType === BiometryTypes.TouchID) {
                        console.log('TouchID is supported');
                        typeNumber = 2;
                    }
                    else if (biometryType === BiometryTypes.Biometrics) {
                        console.log('Biometrics is supported');
                        typeNumber = 3;
                    } else {
                        console.log('nothing biometrics found');
                    }
                }
                else {
                    console.warn('Biometrics not supported');
                }
                navigation.replace('Login', { typeNumber, usrName });
            }).catch(e => {
                console.warn('error al obtener data biometrics ', e);
                navigation.replace('Login', { typeNumber: 0, usrName });
            })
    }
    useEffect(() => {
        setTimeout(() => checkBiometrics(), 500);
    }, []);

    return (
        <SafeAreaView style={estilos.background}>
            <View>
                <Image source={require('../assets/dotech_logo.png')} transition={false} style={estilos.icon_splash} />
                <Text style={appStyles.textHeader}>AppController</Text>
            </View>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colores.white,
        justifyContent: 'center',
        alignItems: 'center',

    },
    icon_splash: { resizeMode: 'contain', height: 200, width: 200 },
});
export default SplashScreen;
