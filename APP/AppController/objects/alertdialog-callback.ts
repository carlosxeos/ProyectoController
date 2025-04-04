/* eslint-disable prettier/prettier */
export interface AlertDialogCallback {
  text: string;
  onClick: () => Promise<boolean>; // esto ayuda a saber si debe hacer el cierre automatico al terminar la funcion
}

export const defaultAlertCallback: AlertDialogCallback = {
  onClick: async() => {
    return true;
  },
  text: 'Ok',
};


export const defaultCancelNoCallback : AlertDialogCallback = {
  onClick: async() => {
    return true;
  },
  text: 'No',
};