import { ADMIN_PANEL_URL } from './constants';

export default [
    { id: 'users', path: ADMIN_PANEL_URL, exact: true, title: 'Пользователи' },
    // { id: 'qiwi', path: `${ADMIN_PANEL_URL}/qiwi`, exact: true, title: 'Qiwi' },
    { id: 'messages', path: `${ADMIN_PANEL_URL}/messages`, exact: true, title: 'Сообщения' },
    { id: 'credentials', path: `${ADMIN_PANEL_URL}/credentials`, exact: true, title: 'Смена учетных данных', notMenu: true },
    { id: 'payments', path: `${ADMIN_PANEL_URL}/payments`, exact: true, title: 'Реквизиты' },
    { id: 'moneyOutput', path: `${ADMIN_PANEL_URL}/outputs`, exact: true, title: 'Запросы на вывод' }
];
