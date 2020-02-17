import { notification } from 'antd';

export const openErrorNotification = (message, title = 'Something went wrong', placement = 'bottomRight') => {
  notification.error({
    message: title,
    description: message,
    placement: placement,
  });
};

export const openInfoNotification = (message, title = 'Hurray!', placement = 'bottomRight') => {
  notification.info({
    message: title,
    description: message,
    placement: placement,
  });
};
