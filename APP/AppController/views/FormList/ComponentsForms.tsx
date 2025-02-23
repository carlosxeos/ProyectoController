/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/**
 * Componente que obtiene diversos items por tipos
 * @param param0 _item list
 * @param handleChange change
 * @param form formulario usado
 * @param errorId id del input con error, si es -1 no se muestra en ninguno
 * @returns
 */

// import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
// import ImageButton from '../../components/ImageButton';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { Asset, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
// import * as RNFS from 'react-native-fs';
const DeviceiOS = Platform.OS === 'ios';
export const ComponentForm = ({ item }: any, form: any, setform, idError, setidError) => {
    const handleChange = (val = null, { id = -1 }, parent = null) => {
        setidError(-1);
        if (parent) { // si es una pregunta con preguntas anidadas
            setform(prev => {
                return { ...prev, [id]: val };
            });
        } else {
            setform(prev => {
                return { ...prev, [id]: val };
            });
        }
    };
    const handleInput = (_item: any) => {
        switch (_item.type) {
            case 'input':
                return (
                    <View
                        style={[estilos.cardViewBack, estilos.shadowEffect]}
                        key={_item.id}>
                        <TextInput
                            label={_item.hint}
                            value={form[_item.id]}
                            maxLength={_item.maxLength}
                            keyboardType={_item?.inputType}
                            secureTextEntry={_item?.password ? true : false}
                            autoComplete={_item?.autocomplete || 'name'}
                            onChangeText={v => handleChange(v, _item)}
                            autoCorrect={_item?.autoCorrect === true}
                            autoCapitalize={_item?.autoCapitalize || 'none'}
                            style={estilos.textInputs}
                            left={<TextInput.Icon icon={_item.icon || 'account'} iconColor={localColores.Primary} />}
                            mode="outlined"
                            textColor={localColores.Primary}
                            theme={{
                                colors: {
                                    primary: localColores.Primary,
                                    disabled: '#ffffff',
                                    onSurfaceVariant: localColores.PrimaryDark,
                                },
                            }}
                            error={
                                idError === _item.id //? _item.error : undefined
                            }
                        />
                    </View>
                );
            case 'title':
                return (
                    <>
                        <View style={[estilos.shadowEffect]} />
                        <View style={[estilos.titleCardContainer, estilos.cardView, estilos.title]}>
                            <Text style={[estilos.titleCard]}>{_item.hint}</Text>
                            <TouchableOpacity style={estilos.titleImageContainer} >
                                <FontAwesomeIcon icon={_item.icon} size={25} color={localColores.black} />
                            </TouchableOpacity>
                        </View>
                    </>
                );
            case 'checkbox':
                return (
                    <View style={estilos.cardViewBack}>
                        <Text
                            style={[
                                estilos.textView,
                                { textAlign: 'center', color: localColores.Primary },
                            ]}>
                            {_item.hint}
                        </Text>
                        <View style={{ flexDirection: 'row', flex: 7, marginBottom: 10 }}>
                            {_item.box.map((e: any) => {
                                let formulario = form[e.id];
                                if (formulario !== true) {
                                    formulario = false;
                                }
                                return (
                                    <View style={{ flex: 1, alignItems: 'center' }} key={e.id}>
                                        <Text style={[estilos.smallText, { marginBottom: 5 }]}>
                                            {e.text}
                                        </Text>
                                        <CheckBox
                                            boxType={'square'}
                                            animationDuration={0.5}
                                            style={estilos.checkBoxSt}
                                            onCheckColor={localColores.grayBackgrounds}
                                            onFillColor={
                                                formulario ? localColores.Primary : localColores.white
                                            }
                                            tintColors={{ true: localColores.PrimaryDark, false: localColores.Primary }}
                                            value={formulario}
                                            onValueChange={v => handleChange(v, e, _item)}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                );
            case 'switch':
                return (
                    <View
                        style={[
                            estilos.cardViewBack,
                            estilos.row,
                            { flex: 1 },
                            estilos.shadowEffect,
                        ]}>
                        <Text style={[estilos.textView, { textAlign: 'right', flex: 1 }]}>
                            {_item.update ? form[_item.id] : _item.hint}
                        </Text>
                        <Switch
                            trackColor={{
                                false: localColores.grayLite,
                                true: localColores.PrimaryDark,
                            }}
                            thumbColor={
                                !form[_item.id] ? localColores.PrimaryDark : localColores.grayBackgrounds
                            }
                            ios_backgroundColor={localColores.grayBackgrounds}
                            onValueChange={v => handleChange(v, _item)}
                            style={{
                                transform: [
                                    { scaleX: DeviceiOS ? 0.7 : 0.9 },
                                    { scaleY: DeviceiOS ? 0.7 : 0.9 },
                                ],
                            }}
                            value={form[_item.id]}
                        />
                    </View>
                );
            default:
                return (
                    <View style={estilos.cardViewBack}>
                        <Text style={[estilos.textView, { textAlign: 'right' }]}>
                            {_item.update ? form[_item.id] : _item.hint}
                        </Text>
                    </View>
                );
        }
    };
    return (
        <View>
            {handleInput(item)}
            {item.child &&
                item.child.map((itemChild: any) =>
                    itemChild.visibleSi === form[item.id] ? handleInput(itemChild) : null
                )}
        </View>
    );
};

const localColores = Object.freeze({
    white: '#FFFFFFFF',
    PrimaryDark: 'rgba(62, 107, 182,1)', // Colores principales aplicacion 62, 107, 182
    Primary: '#4A89A6', // Color para componentes de toolbars, bottom bar, etc
    greenButton: '#58a12b',
    grayBackgrounds: '#ebecf2',
    grayLite: 'rgba(249, 249, 249,1)',
    black: '#000000',
    irexcoreDegradadoNegro: '#353434', //Color para degradado tipo sombra
    irexcoreTextgraycolor: '#979494', //Color para textos
});
const estilos = StyleSheet.create({
    title: {
        marginBottom: -4,
        marginRight: 0,
        marginLeft: 0,

    },
    imageView: {
        width: 80,
        height: 80,
        borderRadius: 120 / 2,
        overflow: 'hidden',
        borderWidth: 3,
        marginVertical: 10,
        borderColor: localColores.Primary,
    },
    checkBoxSt: {
        transform: [
            { scaleX: DeviceiOS ? 0.8 : 1 }, { scaleY: DeviceiOS ? 0.8 : 1 },
        ],
        marginLeft: 3,
    },
    cardViewBack: {
        backgroundColor: localColores.white, paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
    },
    titleCard: {
        color: localColores.PrimaryDark,
        fontWeight: 'bold',
        fontFamily: 'Signika-Medium',
        fontSize: 16,
        flex: 1,
    },
    titleCardContainer: {
        flexDirection: 'row',
    },
    titleImageContainer: {
        flex: 0.1,
    },
    textInputs: {
        marginVertical: 15,
        backgroundColor: localColores.white,
    },

    container: {
        flex: 1,
        alignItems: 'center',
    },
    textView: {
        marginTop: 5,
        color: localColores.Primary,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    itemsCenter: {
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
    },
    shadowEffect: {
        shadowColor: localColores.PrimaryDark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        elevation: 2,
    },
    cardView: {
        //card effect
        shadowColor: localColores.irexcoreDegradadoNegro,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        elevation: 2,
        // fin card effect
        borderRadius: 5,
        padding: 10,
        backgroundColor: localColores.white,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    smallText: {
        marginTop: 2,
        marginBottom: -5,
        color: localColores.PrimaryDark,
        fontSize: 10,
        fontWeight: 'bold',
    },
});


