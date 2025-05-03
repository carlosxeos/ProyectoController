/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import Request, { ErrorHandler } from '../networks/request';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { appVersion, DeviceiOS, keyStorage, testingURL, tokenKey } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../db/tables/session';
import TipoUsuario from '../db/tables/tipoUsuario';
import { ModalContext } from '../context/modal-provider';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Image } from 'react-native-elements';
import { AlertDialogCallback, defaultCancelNoCallback } from '../objects/alertdialog-callback';
import moment from 'moment';
import { RSA } from 'react-native-rsa-native';
let testingCredentials = false;
function Login({ navigation, route }) {
    const { showLoading, hideLoading, showAlertError, showAlertWarning } = useContext(ModalContext);
    const [usuario, setusuario] = useState(testingCredentials ? 'usr.dotech' : '');
    const [password, setpassword] = useState(testingCredentials ? 'Password01' : '');
    const [biometricIcon, setbiometricIcon] = useState<ImageSourcePropType>(null);
    const [passwordMethod, setpasswordMethod] = useState(true);
    const { typeNumber, usrName } = route?.params;
    const request = new Request();
    useEffect(() => {
        setusuario(usrName);
        if (usrName.length > 0) {
            if (typeNumber === 1) {
                setbiometricIcon(require('../assets/face_id.png'));
                setpasswordMethod(false);
            } else if (typeNumber === 2) {
                setbiometricIcon(require('../assets/touch_id.png'));
                setpasswordMethod(false);
            }
            else if (typeNumber === 3) {
                setbiometricIcon(require('../assets/android_fingerprint.png'));
                setpasswordMethod(false);
            }
        }
    }, [typeNumber, usrName]);

    async function handleLoginResponse(response: any) {
        if (response.auth) {
            console.log('inicia sesion');
            const session = new Session();
            await session.removeSession(); // removemos la sesion anterior
            await AsyncStorage.setItem(tokenKey, response.token);
            await AsyncStorage.setItem(keyStorage.user, usuario);
            const resp = await request.getTiposUsuario();
            console.log('tipos usuarios ', resp);
            if (resp instanceof ErrorHandler) {
                showAlertError(resp.error);
                return;
            }
            await (new TipoUsuario()).addAll(resp); // agregamos todo
            await session.addSession(response);
            hideLoading();
            navigation.replace('Menu');
        } else {
            showAlertError(response.error || 'Usuario o contraseña incorrectos');
        }
    }

    const onLoginBiometric = async () => {
        if (!usuario) {
            showAlertError('El usuario no puede estar vacio');
            return;
        }
        getKeyPublic().then(() => { // solo lo usamos para corroborar que exista una llave creada, si es una nueva creada,no va a coinicidir con la del server
            signatureBiometricsDialog().then(({ payload, signature }) => {
                showLoading();
                request.loginUserBiometric(usuario, signature, payload).then(async (response) => {
                    await handleLoginResponse(response);
                }).catch(e => {
                    console.error('loginUserBiometric error ', e);
                    showAlertError('Ha ocurrido un error con este usuario y contraseña');
                });
            }).catch(e => {
                console.warn('error ', e);
                showAlertError(e);
            });
        }).catch(keyErr => {
            console.warn('onLoginBiometric ', keyErr);
            showAlertError(keyErr);
        });
    };

    const handleShowUser = () => {
        setpasswordMethod(true);
    };
    const biometricButton = () => (
        <>
            <TouchableOpacity style={[appStyles.itemsCenter, appStyles.cardView, estilos.biometricButton]} onPress={onLoginBiometric}>
                <Image source={biometricIcon} style={estilos.biometricIcon} transition={false} />
            </TouchableOpacity>
            <Text style={[appStyles.textView, estilos.showPasswordText]}>- O -</Text>
            <TouchableOpacity>
                <Text style={[appStyles.textView, estilos.showPasswordText]} onPress={handleShowUser}>Ingresar con contraseña</Text>
            </TouchableOpacity>
        </>
    );

    /**
     * metodo para generar llaves publicas a partir de datos biometricos
     * @returns key public guardada en asyncstorage
     */
    const getKeyPublic = async (): Promise<string> => {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
        // Verificar si ya existen claves biométricas
        const keyBiometric = await AsyncStorage.getItem(keyStorage.biometricKey) || '';
        if (keyBiometric && await rnBiometrics.biometricKeysExist()) {
            console.log('Las claves biométricas ya existen');
            return Promise.resolve(keyBiometric);
        } else {
            try {
                const { publicKey } = await rnBiometrics.createKeys();
                await AsyncStorage.setItem(keyStorage.biometricKey, publicKey);
                console.log('my publicKey is ', publicKey);
                return Promise.resolve(publicKey);
            } catch (e) {
                console.warn('public key err ', e);
                if (DeviceiOS) {
                    return Promise.reject('Error al revisar datos biometricos, revise si tiene configurado face id o touch id en el dispositivo');
                } else {
                    return Promise.reject('Error al revisar datos biometricos, revise si tiene configurado huella digital o reconocimiento facial en el dispositivo');
                }
            }
        }
    };

    async function signatureBiometricsDialog() {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
        const epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
        const payload = epochTimeSeconds + ' public key';
        return rnBiometrics.createSignature({
            promptMessage: 'Inicia sesion',
            cancelButtonText: 'cancelar',
            payload,
        }).then(async (v) => {
            if (v.success) {
                console.log('v message ', v);
                return Promise.resolve({ signature: v.signature, payload });
            } else {
                return Promise.reject('No se pudo autenticar este usuario');
            }
        }).catch((e) => {
            console.warn('createsignature error', e.toString());
            return Promise.reject(e.toString());
        });
    }

    /**
     * maneja el logeo de usuario cuando es con user password
     * @param biometricKey llave biometrica
     * @param isBiometric si es false, significa que es un uuid
     * @returns login
     */
    async function handleLoginUserPassword(biometricKey: string, isBiometric: boolean): Promise<boolean> {
        showLoading();
        return request.loginUser(usuario, password, biometricKey, isBiometric).then(async (response) => {
            await handleLoginResponse(response);
            return false;
        }).catch((err) => {
            console.error('newLoginErr ', err);
            showAlertError('Ha ocurrido un error con este usuario y contraseña');
            return false;
        });
    }

    /**
     * refresca el uuid de los casos que no se tieenn datos biometricos
     * @returns uuid
     */
    async function refreshUUID(): Promise<{ uuidCreated: string, timeStamp: string }> {
        const data = await RSA.generateKeys(2048); // Tamaño de clave: 2048 bits
        const publicKeyBase64 = data.public.replace(/-----BEGIN RSA PUBLIC KEY-----|-----END RSA PUBLIC KEY-----|\n/g, '');
        const biometricData = { uuidCreated: publicKeyBase64, timeStamp: moment().utc().format('DD/MM/YY hh:mm:ss') };
        console.log('!!!! new biometricData ', biometricData);
        await AsyncStorage.setItem(keyStorage.biometricUUID, JSON.stringify(biometricData));
        return biometricData;
    }

    async function uuidLogin() {
        let uuidBiometric: { uuidCreated: string, timeStamp: string };
        // Obtenemos el item para ver si hay datos
        try {
            uuidBiometric = JSON.parse(await AsyncStorage.getItem(keyStorage.biometricUUID));
        } catch (exc) {
            console.warn('uuidLogin ', exc);
            uuidBiometric = null;
        }
        if (uuidBiometric) { // si encuentra en item info, logea sin el mensaje
            await handleLoginUserPassword(uuidBiometric.uuidCreated, false);
            return;
        }
        const okClick: AlertDialogCallback = {
            async onClick() {
                // como no tiene datos biometricos creamos un uuid para identificar
                const biometricData = await refreshUUID();
                return await handleLoginUserPassword(biometricData.uuidCreated, false);
            },
            text: 'Si',
        };
        showAlertWarning('No encontramos datos biométricos, son necesarios para iniciar sesión con huella digital/reconocimiento facial ,¿Desea continuar sin usarlos?', okClick, defaultCancelNoCallback);
    }
    /**
     * maneja el inicio de sesion con modo usuario y password
     * @returns returns
     */
    async function onLoginButton() {
        if (!usuario || !password) {
            showAlertError('Ingrese un usuario y una contraseña');
            return;
        }
        // si es 0 no tiene soporte de huella digital o face id
        if (typeNumber === 0) {
            await uuidLogin();
            return;
        }
        // maneja con soporte huella digital
        getKeyPublic().then(async (keyBiometric) => {
            await handleLoginUserPassword(keyBiometric, true);
        }).catch(async (e: string) => {
            console.warn('error onLoginButton ', e);
            showAlertError(e);
        });
    }

    // body
    return (
        <View style={appStyles.flexOne}>
            <View style={[appStyles.bodyView, estilos.containerPrincipal]}>
                <Text style={appStyles.textHeader}>Ingresa tus credenciales</Text>
                <TextInput
                    label="Usuario" value={usuario}
                    style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                    onChangeText={setusuario}
                    editable={passwordMethod}
                    mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                    activeOutlineColor={colores.Primary} />
                {
                    (passwordMethod) ?
                        <>
                            <TextInput
                                label="Contraseña" value={password}
                                editable={passwordMethod}
                                style={appStyles.textInput} autoCorrect={false} autoCapitalize={'none'}
                                secureTextEntry
                                onChangeText={setpassword}
                                mode="outlined" outlineColor={colores.irexcoreDegradadoNegro}
                                activeOutlineColor={colores.Primary} />
                            <TouchableOpacity style={[appStyles.buttonRound]}
                                onPress={onLoginButton}>
                                <Text style={appStyles.textButtonLogin}>{'Ingresar'}</Text>
                            </TouchableOpacity>
                        </>
                        : biometricButton()
                }
            </View>
            <Text style={[appStyles.mediumTextView, estilos.versionText]}>{`${testingURL ? 'Loc. ' : 'V.'} ${appVersion}`}</Text>
        </View>
    );
}
const estilos = StyleSheet.create({
    versionText: { flex: 0.1, alignSelf: 'center' },
    containerPrincipal: { flex: 0.9 },
    biometricIcon: { width: 50, height: 50, tintColor: colores.PrimaryDark },
    biometricButton: {
        marginTop: '5%',
        width: 100,
        alignSelf: 'center',
    },
    showPasswordText: { color: colores.PrimaryDark, marginTop: 10 },
});
export default Login;
