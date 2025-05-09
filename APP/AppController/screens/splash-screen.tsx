/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native-elements';
import { appStyles, colores } from '../resources/globalStyles';
import { useContext, useEffect } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { AppContext } from '../context/app-context';

function SplashScreen({ navigation }) {
    const { sessionData, setSessionData } = useContext(AppContext);
    async function checkBiometrics() {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
        if (sessionData?.biometricType !== -2) { // si es distinto a -2 significa que ya hizo esta validacion del sensor
            console.log('entrando sin validar ', sessionData);
            navigation.replace('Login', { typeNumber: sessionData});
            return;
        }
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
                setSessionData({ biometricType: typeNumber });
                navigation.replace('Login');
            }).catch(e => {
                console.warn('error al obtener data biometrics ', e);
                setSessionData({ biometricType: 0 });
                navigation.replace('Login');
            });
    }
    useEffect(() => {
        setTimeout(() => checkBiometrics(), 100);
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
    icon_splash: { resizeMode: 'center', height: 300 },
});
export default SplashScreen;
