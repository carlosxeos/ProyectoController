/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/**
 * Componente que obtiene diversos items por tipos
 * @param param0 item list
 * @param handleChange change
 * @param form formulario usado
 * @param errorId id del input con error, si es -1 no se muestra en ninguno
 * @returns
 */

// import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
// import ImageButton from '../../components/ImageButton';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { Asset, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
// import * as RNFS from 'react-native-fs';
const DeviceiOS = Platform.OS === 'ios';
export const ComponentForm = ({ item }: any, handleChange: CallableFunction, form: any, errorId = -1) => {
    const handleInput = (_itemInput: any) => {
        // const handleClickPhoto = () => {
        //     handleCamera((e: any) => {
        //         handleChange(e, itemInput);
        //     });
        // };

        const hint: string = item.hint;
        switch (item.type) {
            case 'input':
                return (
                    <View
                        style={[estilos.cardViewBack, estilos.shadowEffect]}
                        key={item.id}>
                        <TextInput
                            label={hint}
                            value={form[item.id]}
                            maxLength={item.maxLength}
                            keyboardType={item?.inputType}
                            secureTextEntry={item?.password ? true : false}
                            onChangeText={v => handleChange(v, item)}
                            autoCorrect={item?.autoCorrect === true}
                            autoCapitalize={item?.autoCapitalize || 'none'}
                            style={estilos.textInputs}
                            left={<TextInput.Icon icon={item.icon || 'account'} iconColor={localColores.Primary} />}
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
                                errorId === item.id //? item.error : undefined
                            }
                        />
                    </View>
                );
            case 'title':
                return (
                    <>
                        <View style={[estilos.shadowEffect]} />
                        <View style={[estilos.titleCardContainer, estilos.cardView, estilos.title]}>
                            <Text style={[estilos.titleCard]}>{hint}</Text>
                            <TouchableOpacity style={estilos.titleImageContainer} >
                                <FontAwesomeIcon icon={item.icon} size={25} color={localColores.black} />
                            </TouchableOpacity>
                        </View>
                    </>
                );
            // case 'photo':
            //     return (
            //         <>
            //             {form[item.id] ? (
            //                 <View
            //                     style={[
            //                         estilos.container,
            //                         { backgroundColor: localColores.white },
            //                     ]}>
            //                     <TouchableOpacity
            //                         activeOpacity={0.8}
            //                         style={[
            //                             estilos.itemsCenter,
            //                             { paddingBottom: 10, width: 100 },
            //                         ]}
            //                         onPress={handleClickPhoto}>
            //                         <Image
            //                             style={estilos.imageView}
            //                             source={{ uri: `data:image/jpeg;base64,${form[item.id]}` }}
            //                         />
            //                         <Text
            //                             style={[
            //                                 estilos.smallText,
            //                                 { textAlign: 'center', color: localColores.black },
            //                             ]}>
            //                             {hint}
            //                         </Text>
            //                     </TouchableOpacity>
            //                 </View>
            //             ) : (
            //                 <View>
            //                     <ImageButton
            //                         faIcon={faCameraRetro}
            //                         iconColor={localColores.white}
            //                         buttonColor={item.color}
            //                         text={hint}
            //                         textStyle={{ fontSize: 12 }}
            //                         onClick={handleClickPhoto}
            //                         buttonSize={80}
            //                     />
            //                 </View>
            //             )}
            //         </>
            //     );
            case 'checkbox':
                return (
                    <View style={estilos.cardViewBack}>
                        <Text
                            style={[
                                estilos.textView,
                                { textAlign: 'center', color: localColores.Primary },
                            ]}>
                            {hint}
                        </Text>
                        <View style={{ flexDirection: 'row', flex: 7, marginBottom: 10 }}>
                            {item.box.map((e: any) => {
                                let formulario = form[item.id];
                                if (formulario && formulario[e.id]) {
                                    formulario = formulario[e.id].enable;
                                } else {
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
                                            tintColors={{ true: localColores.PrimaryDark, false: localColores.grayLite }}
                                            value={formulario}
                                            onValueChange={v => handleChange(v, e, item)}
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
                            {item.update ? form[item.id] : hint}
                        </Text>
                        <Switch
                            trackColor={{
                                false: localColores.grayLite,
                                true: localColores.PrimaryDark,
                            }}
                            thumbColor={
                                !form[item.id] ? localColores.PrimaryDark : localColores.grayBackgrounds
                            }
                            ios_backgroundColor={localColores.grayBackgrounds}
                            onValueChange={v => handleChange(v, item)}
                            style={{
                                transform: [
                                    { scaleX: DeviceiOS ? 0.7 : 0.9 },
                                    { scaleY: DeviceiOS ? 0.7 : 0.9 },
                                ],
                            }}
                            value={form[item.id]}
                        />
                    </View>
                );
            default:
                return (
                    <View style={estilos.cardViewBack}>
                        <Text style={[estilos.textView, { textAlign: 'right' }]}>
                            {item.update ? form[item.id] : hint}
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
                    itemChild.visibleSi === form[item.id] ? handleInput(itemChild) : null,
                )}
        </View>
    );
};
/*
export const handleCamera = (setPhoto: any) => {
    const callback = async (resource: ImagePickerResponse) => {
        if (!resource.didCancel) {
            const asset: Asset | null = resource?.assets?.length ? resource?.assets[0] : null;
            if (!asset) {
                return;
            }
            setPhoto(asset.base64); // inserta la foto actual en base64
            let fileImages = '';
            if (DeviceiOS) { // si es un dispositivo iOS
                const uriSplit = asset.uri?.split('/');
                fileImages = uriSplit?.slice(0, uriSplit.length - 1).join('/') || '';
            }
            else {
                fileImages = RNFS.CachesDirectoryPath; // lee el directorio de cache
            }

            console.log('image path ', fileImages);
            await RNFS.exists(fileImages).then(async (res) => { // encuentra el directorio
                if (res) { // si existe el directorio , trata de borrar todas las fotos
                    RNFS.readDir(fileImages).then(items => {
                        items.forEach(item => { // itera para borrar todos las fotos que sean de rn image picker
                            if (item.isFile() && (DeviceiOS || item.name.includes('rn_image_picker'))) {
                                RNFS.unlink(`${fileImages}/${item.name}`);
                                // console.log("item existente ", item.path);
                            }
                        });
                    });
                }
            });
        }
    };
    console.log('ios Version ', Platform.Version);
    launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.1 }, callback);
};
*/
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

