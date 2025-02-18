/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { WorkerInputs, DeviceiOS } from '../../Constants';
import { colores, appStyles } from '../../resources/globalStyles';
import { ComponentForm } from '../../views/FormList/ComponentsForms';
import Request, { ErrorHandler } from '../../networks/request';
import { Porton } from '../../objects/porton';
import AlertDialog from '../../components/AlertDialog';

/**
 * Pantalla para agregar usuarios nuevos
 */
export function AddUser({ route, navigation }) {
    let count = 11;
    const [form, setform] = useState({});
    const [idError, setidError] = useState(-1);
    const [inputs, setinputs] = useState([]);
    const [boxPortones, setboxPortones] = useState<[{ id, text, uuid }]>([] as any);
    const [alertVisible, setalertVisible] = useState(false);
    const request = new Request();
    const data: ErrorHandler | Porton[] = route?.params?.data; // id
    useEffect(() => {
        getPortones();
    }, []);

    const getPortones = async () => {
        setinputs(() => {
            // en caso que no pudieran obtenerse los portones
            if (data instanceof ErrorHandler) {
                return WorkerInputs;
            }
            const val: [{ id, text, uuid }] = [] as any;
            for (const element of data) {
                val.push({
                    id: count++,
                    text: element.descripcion,
                    uuid: element.uuid,
                });
            }
            setboxPortones(val);
            return [...WorkerInputs, { id: 8, hint: 'Seleccione portones a los cuales va a tener acceso', type: 'checkbox', box: val }];
        });
    };

    const validateForm = (): string => {
        for (const v of inputs) {
            // si es titulo no hay que revisar
            if (v.type === 'title' || v.type === 'checkbox') {
                continue;
            }
            const valueForm = form[v.id];
            console.log('value ' + v.id, ': ', valueForm);
            // si esta vacio el campo, da error directamente
            if (!valueForm) {
                return v?.error;
            }
            if (v?.minLength && v?.minLength > valueForm.length) {
                return v?.error;
            }
            if (v?.maxLength && valueForm.length > v?.maxLength) {
                return v?.error;
            }
            if (v?.regex && !(v?.regex).test(valueForm)) {
                return v?.error;
            }
        }
        // si las contraseñas no son iguales si que no coinciden
        if (form[5] !== form[6]) {
            return 'La contraseña con coincide';
        }
        return '';
    };
    const addAction = async () => {
        const errorString = "";//validateForm();
        if (errorString.length > 0) {
            Alert.alert('Error', errorString);
        }
        else {
            const filterBoxPortones = boxPortones.filter(b => form[b.id]);
            if (filterBoxPortones.length > 0) {
                setalertVisible(true);
                if (await request.checkUsername(form[4])) {
                    setalertVisible(false);
                    navigation.navigate('DetailDoorUser', { form, portones: filterBoxPortones });
                } else {
                    setalertVisible(false);
                    Alert.alert('Error', 'El username es inválido o ya existe');
                }
            } else {
                Alert.alert('Error', 'Selecciona al menos un portón');
            }
        }
    };
    const FooterButton = () => {
        return (
            < View style={{ marginVertical: 10 }}>
                <TouchableOpacity style={[appStyles.buttonLogin, appStyles.buttonRound, { flexDirection: 'row', justifyContent: 'center' }]} onPress={addAction}>
                    <Text style={appStyles.textButtonLogin}>{'Agregar'}</Text>
                </TouchableOpacity>
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colores.grayBackgrounds }}>
            <StatusBar animated backgroundColor={colores.PrimaryDark} barStyle={'light-content'} />
            <AlertDialog
                setVisible={setalertVisible} visible={alertVisible}
                alertColor={colores.redDotech}
                handleNeutral={undefined}
                loading={true} />
            <KeyboardAwareFlatList
                scrollEnabled
                removeClippedSubviews={!DeviceiOS}
                style={{ paddingHorizontal: 20 }} data={inputs}
                renderItem={(item) => ComponentForm(item, form, setform, idError, setidError)}
                ListFooterComponent={FooterButton}
                keyExtractor={item => item.id} />
        </SafeAreaView>
    );
}
