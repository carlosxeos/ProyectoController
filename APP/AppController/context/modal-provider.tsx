/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {
  faWarning,
  faCheckCircle,
  IconDefinition,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { createContext, useState } from 'react';
import {
  AlertDialogCallback,
  defaultAlertCallback,
} from '../objects/alertdialog-callback';
import { colores } from '../resources/globalStyles';

export const ModalContext = createContext<any>(null);
/**
 * provider para manejar los alerts
 * @param param0 childers
 * @returns provider
 */
export const ModalProvider = ({ children }) => {
  const defaultProperties = {
    loading: false,
    visible: false,
    text: '',
    color: '',
    icon: faWarning,
    neutral: null,
    negative: null,
    positive: null,
  };
  const [alertProperties, setAlertProperties] = useState(defaultProperties);
  /**
   * Funcion para cerrar modal
   */
  function closeModal() {
    setAlertProperties(defaultProperties);
  }

  /**
   * Muestra un alert de loading
   */
  function showLoading() {
    setAlertProperties(_ => {
      return { ...defaultProperties, loading: true, visible: true };
    });
  }

  /**
   * esconde el loading
   */
  function hideLoading() {
    closeModal();
  }

  /**
   * muestra un alert de tipo error, color rojo y con un icono de error
   * @param text mensaje
   * @param positive accion al seleccionar boton positivo(si lo dejas vacio selecciona defaultAlertCallback)
   * @param negative accion al seleccionar boton negativo (opcional)
   * @param neutral accion al seleccion boton neutral (opcional)
   */
  function showAlertError(
    text: string,
    positive: AlertDialogCallback = defaultAlertCallback,
    negative: AlertDialogCallback = undefined,
    neutral: AlertDialogCallback = undefined,
  ) {
    setAlertProperties({
      loading: false,
      visible: true,
      text,
      positive,
      negative,
      neutral,
      color: colores.redDotech,
      icon: faTimesCircle,
    });
  }

  /**
   * muestra un alert de tipo warning, color amarillo y con un icono de warning
   * @param text mensaje
   * @param positive accion al seleccionar boton positivo(si lo dejas vacio selecciona defaultAlertCallback)
   * @param negative accion al seleccionar boton negativo (opcional)
   * @param neutral accion al seleccion boton neutral (opcional)
   */
  function showAlertWarning(
    text: string,
    positive: AlertDialogCallback = defaultAlertCallback,
    negative: AlertDialogCallback = undefined,
    neutral: AlertDialogCallback = undefined,
  ) {
    setAlertProperties({
      loading: false,
      visible: true,
      text,
      positive,
      negative,
      neutral,
      color: colores.warningColor,
      icon: faWarning,
    });
  }

  /**
   * muestra un alert de tipo success, color verde y con un icono de check
   * @param text mensaje
   * @param positive accion al seleccionar boton positivo(si lo dejas vacio selecciona defaultAlertCallback)
   * @param negative accion al seleccionar boton negativo (opcional)
   * @param neutral accion al seleccion boton neutral (opcional)
   */
  function showAlertSucess(
    text: string,
    positive: AlertDialogCallback = defaultAlertCallback,
    negative: AlertDialogCallback = undefined,
    neutral: AlertDialogCallback = undefined,
  ) {
    setAlertProperties({
      loading: false,
      visible: true,
      text,
      positive,
      negative,
      neutral,
      color: colores.greenButton,
      icon: faCheckCircle,
    });
  }

  /**
   * se invoca cuando requieres un alert que no pueda ser cumplido con los tradicionales
   * @param text texto
   * @param positive callback de boton positive
   * @param negative callback de boton negative
   * @param neutral callback de boton neutral
   * @param color color que debe tomar la alerta
   * @param icon icono que debe mostrarse (el color del icono es basado en el color elegido previamente)
   */
  function showCustomAlertDialog(
    text: string,
    positive: AlertDialogCallback,
    negative: AlertDialogCallback,
    neutral: AlertDialogCallback,
    color: string,
    icon: IconDefinition,
  ) {
    setAlertProperties({
      loading: false,
      visible: true,
      text,
      positive,
      negative,
      neutral,
      color,
      icon,
    });
  }
  return <ModalContext.Provider value={
    {
      alertProperties, closeModal, showLoading, hideLoading, showAlertError,
      showAlertWarning, showAlertSucess, showCustomAlertDialog,
    }}>{children}</ModalContext.Provider>;
};
