/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {
  faWarning,
  faTimes,
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
  function closeModal() {
    setAlertProperties(defaultProperties);
  }
  function showLoading() {
    setAlertProperties(_ => {
      return { ...defaultProperties, loading: true, visible: true };
    });
  }

  function hideLoading() {
    closeModal();
  }

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
