/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appStyles, colores } from '../resources/globalStyles';

/**
 * Alert dialog interface
 * @param setVisible, variable para saber cuando ocultar el modal, es necesaria unicamente cuando no se agrega ninguno de los 3 tipos de botones
 *      ( handlePositive, handleNegative, handleNeutral)
 */

export default function AlertDialog({ setVisible = undefined, visible, handlePositive = undefined, handleNegative = undefined, handleNeutral = undefined, text = '', loading = false, alertColor = 'red', lottiePath = undefined, faIcon = undefined, speed = 1 }) {
    text = text ?? 'Mensaje';
    alertColor = alertColor ?? colores.PrimaryDark;
    faIcon = faIcon ?? faInfoCircle;
    const negativeValue = handlePositive && handleNeutral ? 'medium' : handlePositive ? 'right' : handleNeutral ? 'left' : 'center';

    const ButtonDialog = ({ handle, color, position }) => {
        color = color ?? colores.Primary;
        const textColor = colores.white;
        const bottomLeft = ['left', 'center'].includes(position);
        const bottomRight = ['right', 'center'].includes(position);
        const inlineStyle = {
            backgroundColor: color,
            borderBottomLeftRadius: bottomLeft ? 10 : 0,
            borderBottomRightRadius: bottomRight ? 10 : 0,
        };
        return (
            <>
                <TouchableOpacity activeOpacity={0.9} style={[
                    estilos.buttonStyle, inlineStyle,
                ]} onPress={async() => { if (await handle.onClick()) { setVisible(false); } }}>
                    <Text style={[estilos.textBtn, { color: textColor }]}>{handle.text}</Text>
                </TouchableOpacity>
            </>
        );
    }; // fin buttonDialog
    const animationRef = useRef<LottieView>(null);
    useEffect(() => {
        animationRef.current?.play();
    });
    return (
        visible ?
            <Modal animationType="fade" transparent={true} visible onRequestClose={() => loading ? null : setVisible(false)}>
                <View style={estilos.alertDialog}>
                    {loading ? <ActivityIndicator size="large" color={colores.white} /> :
                        <View style={estilos.alertContent}>
                            <View style={estilos.viewContainerCard}>
                                {
                                    // si agregas el faIcon y lottiePath en un mismo alert,
                                    // el lottiePath tiene mas prioridad
                                    lottiePath ?
                                        <LottieView
                                            ref={animationRef}
                                            speed={speed}
                                            loop={true} source={lottiePath} />
                                        : <FontAwesomeIcon style={estilos.iconStyle} icon={faIcon ?? faInfoCircle} color={alertColor} size={60} />
                                }
                            </View>
                            <Text style={[appStyles.textView, estilos.alertText]}>{text}</Text>
                            <View style={[estilos.buttonContainer, { backgroundColor: alertColor }]}>
                                {handlePositive && <ButtonDialog position={handleNeutral || handleNegative ? 'left' : 'center'} handle={handlePositive} color={alertColor} />}
                                {handleNeutral && <ButtonDialog position={negativeValue} handle={handleNeutral} color={alertColor} />}
                                {handleNegative && <ButtonDialog position={handleNeutral || handlePositive ? 'right' : 'center'} handle={handleNegative} color={alertColor} />}
                                {
                                    (!handlePositive && !handleNeutral && !handleNegative) && <ButtonDialog position={'center'} handle={{ onClick: () => setVisible(false), text: 'OK' }} color={alertColor} />
                                }
                            </View>
                        </View>}
                </View>
            </Modal>
            : <></>
    );

}

const estilos = StyleSheet.create({
    alertDialog: {
        flex: 1, justifyContent: 'center',
        alignItems: 'center', alignSelf: 'center',
        width: '100%', marginHorizontal: 20,
        paddingHorizontal: 30,
        backgroundColor: colores.irexcoreTransparente,
    },
    alertTitle: {
        textAlign: 'center', fontSize: 18,
        padding: 5, color: '#fff',
        alignSelf: 'stretch',

    },
    alertContent: {
        backgroundColor: 'white', ustifyContent: 'center',
        width: '100%',
        borderRadius: 10,
    },
    alertText: {
        paddingHorizontal: 20, marginTop: 15,
        textAlign: 'center', color: colores.black,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: -1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    buttonStyle: {
        backgroundColor: '#78BE21',
        paddingHorizontal: 15,
        paddingVertical: 15,
        flex: 1,
    },
    textBtn: {
        color: '#fff',
        fontSize: 16,
        alignSelf: 'center',
    },
    viewContainerCard: { width: '100%', height: 100 },
    iconStyle: { alignSelf: 'center', marginTop: 20 },
});
