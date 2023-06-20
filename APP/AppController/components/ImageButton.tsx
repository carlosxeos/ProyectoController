/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {faQuestion} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export default function ImageButton({
  faIcon = faQuestion,
  iconColor = 'white',
  buttonColor = 'blue',
  text = '',
  textStyle = {},
  onClick,
  buttonSize = 100,
}): JSX.Element {
  textStyle = textStyle ? [estilos.textStyle, textStyle] : estilos.textStyle;
  const iconSize = buttonSize / 3;
  return (
    <View style={[{width: buttonSize, height: buttonSize * 1.5}]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[estilos.itemsCenter, {width: buttonSize}]}
        onPress={onClick}>
        <Svg height={buttonSize} width={buttonSize} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" fill={buttonColor} />
        </Svg>
        <View style={estilos.cameraIcon}>
          <FontAwesomeIcon icon={faIcon} size={iconSize} color={iconColor} />
        </View>
      </TouchableOpacity>
      <Text style={[textStyle, {marginTop: 0}]}>{text}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cameraIcon: {
    zIndex: 2,
    elevation: 2,
    position: 'absolute',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  itemsCenter: {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
  },
});
