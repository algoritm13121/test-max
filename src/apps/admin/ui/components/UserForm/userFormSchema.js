import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldRadios from '../Form/fields/FormFieldRadios/FormFieldRadios';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldDownload from '../Form/fields/FormFieldDownload/FormFieldDownload';
import FormFieldSelect from '../Form/fields/FormFieldSelect/FormFieldSelect';

import maps from '../../../../client/ui/hocs/lang/maps';

const countries = [];

for (const key in maps.ru.accountInfo.countryInfo) {
    countries.push({ value: key, name: maps.ru.accountInfo.countryInfo[key] });
}

export default function ({ data: { title, dirName } = {} } = {}) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'form-title',
                schema: {
                    label: title,
                    variant: 'h5'
                }
            },
            {
                component: FormFieldInput,
                name: 'name',
                schema: {
                    label: 'Имя'
                },
                validators: [
                    { name: 'required', options: { text: 'Укажите имя пользователя' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'surname',
                schema: {
                    label: 'Фамилия'
                },
                validators: [
                    { name: 'required', options: { text: 'Укажите фамилию пользователя' } }
                ]
            },
            {
                component: FormFieldCheckbox,
                name: 'isVipStatus',
                schema: {
                    label: 'VIP статус',
                    disabled: false
                }
            },
            {
                component: FormFieldInput,
                name: 'accountStatus',
                schema: {
                    label: 'Статус аккаунта'
                }
            },
            {
                component: FormFieldTitle,
                name: 'titleType',
                schema: {
                    label: 'Активность',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldRadios,
                name: 'isActive',
                schema: {
                    label: 'Активность',
                    options: [
                        { label: 'Активный', value: 'true' },
                        { label: 'Неаквивный', value: 'false' }
                    ]
                }
            },
            {
                component: FormFieldInput,
                name: 'email',
                schema: {
                    label: 'Электронная почта'
                },
                validators: [
                    { name: 'required', options: { text: 'Укажите электронный адрес пользователя' } },
                    { name: 'email' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'password',
                schema: {
                    label: 'Пароль'
                }
            },
            {
                component: FormFieldInput,
                name: 'phone',
                schema: {
                    label: 'Номер телефона'
                },
                validators: [
                    { name: 'required', options: { text: 'Укажите номер телефона пользователя' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'titleType',
                schema: {
                    label: 'Страна',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldSelect,
                name: 'country',
                schema: {
                    label: 'Страна',
                    options: countries
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldInput,
                name: 'city',
                schema: {
                    label: 'Город'
                }
            },
            {
                component: FormFieldInput,
                name: 'address',
                schema: {
                    label: 'Адресс'
                }
            },
            {
                component: FormFieldTitle,
                name: 'prooOfIdentity-title',
                schema: {
                    label: 'Подтверждения личности',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldDownload,
                name: 'identity',
                schema: {
                    max: 1,
                    dirName
                }
            },
            {
                component: FormFieldTitle,
                name: 'prooOfResidence-title',
                schema: {
                    label: 'Подтверждение места жительства',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldDownload,
                name: 'residence',
                schema: {
                    max: 1,
                    dirName
                }
            },
            {
                component: FormFieldTitle,
                name: 'cardFront-title',
                schema: {
                    label: 'Кредитная карта(лицевая сторона)',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldDownload,
                name: 'cardFront',
                schema: {
                    max: 1,
                    dirName
                }
            },
            {
                component: FormFieldTitle,
                name: 'cardFront-title',
                schema: {
                    label: 'Кредитная карта(обратная сторона)',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldDownload,
                name: 'cardBack',
                schema: {
                    max: 1,
                    dirName
                }
            },
            {
                component: FormFieldTitle,
                name: 'otherDocuments-title',
                schema: {
                    label: 'Другие документы',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldDownload,
                name: 'others',
                schema: {
                    dirName
                }
            },
            {
                component: FormFieldCheckbox,
                name: 'blocked',
                schema: {
                    label: 'Заблокировать пользователя',
                    disabled: false
                }
            },
            {
                component: FormFieldButton,
                name: 'submit',
                schema: {
                    label: 'Сохранить',
                    type: 'submit'
                }
            }
        ]
    };
}
