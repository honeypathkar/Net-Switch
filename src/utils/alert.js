import { ToastAndroid } from 'react-native';

export const showAlert = ({ msg }) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};
