/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { DeviceiOS } from '../Constants';
import { ComponentForm } from './FormList/ComponentsForms';

/**
 * 
 * @param onSubmit function, parametro string [] convertido a A100C720
 * @returns 
 */
const TimeInputModal = ({ visible, onClose, onSubmit }) => {
    const [entryHour, setEntryHour] = useState('');
    const [entryMinute, setEntryMinute] = useState('');
    const [exitHour, setExitHour] = useState('');
    const [exitMinute, setExitMinute] = useState('');
    const [form, setForm] = useState({});
    const [idError, setIdError] = useState(-1);
    const checkBox = [
        {
            id: 1,
            hint: 'Selecciona el dia',
            type: 'checkbox',
            box: [
                { id: 2, text: 'Do' }, // Domingo
                { id: 3, text: 'Lu' }, // lunes
                { id: 4, text: 'Ma' }, // martes
                { id: 5, text: 'Mi' }, // miercoles
                { id: 6, text: 'Ju' }, // jueves
                { id: 7, text: 'Vi' }, // Viernes
                { id: 8, text: 'Sa' }, // Sabado
            ],
        },
    ];

    const validateTime = () => {
        const validateHour = hour => hour >= 0 && hour <= 23;
        const validateMinute = minute => minute >= 0 && minute <= 59;
        if (
            entryHour.length <= 0 ||
            !validateHour(+(entryHour)) ||
            entryMinute.length <= 0 ||
            !validateMinute(+(entryMinute))
        ) {
            Alert.alert('Error', 'Hora de entrada inválida.');
            return false;
        }

        if (
            exitHour.length <= 0 ||
            !validateHour(+(exitHour)) ||
            exitMinute.length <= 0 ||
            !validateMinute(+(exitMinute))
        ) {
            Alert.alert('Error', 'Hora de salida inválida.');
            return false;
        }

        const entryTime = +(entryHour) * 60 + (+entryMinute);
        const exitTime = +(exitHour) * 60 + (+exitMinute);

        if (entryTime >= exitTime) {
            Alert.alert(
                'Error',
                'La hora de entrada debe ser menor a la hora de salida.',
            );
            return false;
        }

        return true;
    };

    const cleanInputs = () => {
        setEntryHour('');
        setEntryMinute('');
        setExitHour('');
        setExitMinute('');
        setForm({});
    };

    const handleClose = () => {
        cleanInputs();
        onClose();
    };

    const handleAccept = () => {
        if (Object.keys(form).length === 0) {
            Alert.alert(
                'Error',
                'Seleccione al menos un dia de la semana',
            );
            return;
        }
        let daySelected = false;
        for (const key of Object.keys(form)) {
            if (form[key]) {
                daySelected = true;
                break;
            }
        }
        if (!daySelected) {
            Alert.alert(
                'Error',
                'Seleccione al menos un dia de la semana',
            );
            return;
        }
        if (validateTime()) {
            cleanInputs();
            const array: string[] = [];
            for (const key of Object.keys(form)) {
                if (form[key]) {
                    array.push(`${((+key) - 2)}A${(+(entryHour) * 60) + (+entryMinute)}C${((+exitHour * 60) + (+exitMinute))}`);
                }
            }
            onSubmit(array);
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onDismiss={handleClose}
            collapsable={false}
            onRequestClose={handleClose}>
            <View style={styles.modalView}>
                <View style={styles.card}>
                    <KeyboardAwareFlatList
                        removeClippedSubviews={!DeviceiOS}
                        style={{ width: '100%' }}
                        data={checkBox}
                        renderItem={item =>
                            ComponentForm(item, form, setForm, idError, setIdError)
                        }
                        keyExtractor={item => item.id}
                    />
                    <Text style={[styles.modalText]}>Hora en formato 24H</Text>
                    <Text style={styles.modalText}>Entrada</Text>
                    <View style={styles.rowHour}>
                        <TextInput
                            style={styles.input}
                            placeholder="HH"
                            value={entryHour}
                            onChangeText={setEntryHour}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Text style={[styles.modalTextCenter]}> : </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM"
                            value={entryMinute}
                            onChangeText={setEntryMinute}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                    </View>
                    <Text style={styles.modalText}>Salida</Text>
                    <View style={styles.rowHour}>
                        <TextInput
                            style={styles.input}
                            placeholder="HH"
                            value={exitHour}
                            onChangeText={setExitHour}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Text style={[styles.modalTextCenter]}> : </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM"
                            value={exitMinute}
                            onChangeText={setExitMinute}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                    </View>
                    <View style={styles.rowHour}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: colores.redDotech }]} onPress={handleClose}>
                            <Text style={appStyles.textButtonLogin}>{'Cancelar'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleAccept}>
                            <Text style={appStyles.textButtonLogin}>{'Aceptar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    button: {
        margin: 5,
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
        backgroundColor: colores.Primary,
        flex: 0.5,
    },
    rowHour: {
        flexDirection: 'row',
    },
    modalTextCenter: {
        textAlignVertical: 'center',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
    },
    card: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        width: '100%',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        marginHorizontal: 20,
        paddingHorizontal: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 20,
        marginBottom: 5,
        width: '30%',
        textAlign: 'center',
        alignSelf: 'center',
        padding: 10,
    },
});

export default TimeInputModal;
