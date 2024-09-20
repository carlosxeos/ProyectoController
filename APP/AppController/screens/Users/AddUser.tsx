/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { WorkerInputs, DeviceiOS } from '../../Constants';
import { colores, appStyles } from '../../resources/globalStyles';
import { ComponentForm } from '../../views/FormList/ComponentsForms';

/**
 *
 * @returns
 */
const renderInputs = [...WorkerInputs];
export function AddUser() {
    const [form, setform] = useState({ });
    const [idError, setidError] = useState(-1);
    const handleChange = (val = null, {id = -1}, parent = null, _fromClock = false) => {
        setidError(-1);
        if (parent) { // si es una pregunta con preguntas anidadas
            console.log('parent');
            setform(prev => {
                return {...prev, [parent?.id]: val};
            });
        } else {
            setform(prev => {
                return {...prev, [id]: val};
            });
        }
    };
    const FooterButton = () => {
        return (
            <View style={{marginVertical: 10}}>
            <TouchableOpacity style={[ appStyles.buttonLogin, appStyles.buttonRound, {flexDirection: 'row', justifyContent: 'center'}]} onPress={()=> {}}>
                <Text style={appStyles.textButtonLogin}>{'Agregar'}</Text>
            </TouchableOpacity>
            </View>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colores.grayBackgrounds }}>
            <StatusBar animated backgroundColor={colores.PrimaryDark} barStyle={'light-content'} />
            <KeyboardAwareFlatList
                scrollEnabled
                removeClippedSubviews={!DeviceiOS}
                style={{ paddingHorizontal: 20 }} data={renderInputs}
                renderItem={(item) => ComponentForm(item, handleChange, form, idError)}
                ListFooterComponent={FooterButton}
                keyExtractor={item => item.id} />
        </SafeAreaView>
    );
}
