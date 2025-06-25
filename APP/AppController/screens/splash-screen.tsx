/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native-elements';
import { appStyles, colores } from '../resources/globalStyles';
import { useContext, useEffect } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { AppContext } from '../context/app-context';
import Geolocation from 'react-native-geolocation-service';
import { getPreciseDistance } from 'geolib';
import { ModalContext } from '../context/modal-provider';
import { hasLocationPermission } from '../resources/PermissionFunctions';
function SplashScreen({ navigation }) {
    const { showAlertWarning } = useContext(ModalContext);
    const { sessionData, setSessionData } = useContext(AppContext);
    async function checkBiometrics() {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
        if (sessionData?.biometricType !== -2) { // si es distinto a -2 significa que ya hizo esta validacion del sensor
            console.log('entrando sin validar ', sessionData);
            navigation.replace('Login', { typeNumber: sessionData });
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

    async function checkDistance() {
        const permisos = await hasLocationPermission();
        if (permisos) {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('Latitud:', position.coords.latitude);
                    console.log('Longitud:', position.coords.longitude);
                    const metters = getPreciseDistance(
                        { latitude: 25.671292504887205, longitude: -100.25896691980049},
                        { latitude: position.coords.latitude, longitude: position.coords.longitude },
                        0.01
                    );
                    Alert.alert('text', 'Latitud:' + position.coords.latitude + ' Longitud:' + position.coords.longitude + 'su pos se encuentra a ' +  metters + ' metros de distancia');
                },
                (error) => {
                    Alert.alert(error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, accuracy: {ios: 'best', android: 'high'} }
            );
        } else {
            showAlertWarning('Se necesitan permisos de ubicacion para usar esta app');
        }
    }
    useEffect(() => {
        //setTimeout(() => checkBiometrics(), 100);
        checkDistance();
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
