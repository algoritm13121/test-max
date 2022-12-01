import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldDate from '../Form/fields/FormFieldDate/FormFieldDate';
import FormFieldRadios from '../Form/fields/FormFieldRadios/FormFieldRadios';

export default function ({ data: { title, isClosed } = {} } = {}) {
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
                name: 'assetName',
                schema: {
                    label: 'Название актива'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните название актива' } }
                ]
            },
            {
                component: FormFieldTitle,
                name: 'titleType',
                schema: {
                    label: 'Статус актива',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldRadios,
                name: 'type',
                schema: {
                    label: 'Статус актива',
                    options: [
                        { label: 'Покупка', value: 'buy' },
                        { label: 'Продажа', value: 'sell' }
                    ]
                }
            },
            {
                component: FormFieldDate,
                name: 'createdAt',
                schema: {
                    label: 'Дата создания ордера'
                },
                type: 'datetime-local',
                validators: [
                    { name: 'required', options: { text: 'Заполните дату создания ордера' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'openingPrice',
                schema: {
                    label: 'Цена открытия'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните цену открытия' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'amount',
                schema: {
                    label: 'Объем'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните объем' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'pledge',
                schema: {
                    label: 'Залог'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните залог' } }
                ]
            },
            {
                component: FormFieldDate,
                name: 'closedAt',
                schema: {
                    label: 'Дата закрытия ордера'
                },
                type: 'datetime-local',
                hidden: !isClosed,
                ...(isClosed ? {
                    validators: [
                        { name: 'required', options: { text: 'Заполните дату закрытия ордера' } }
                    ]
                } : {})
            },
            {
                component: FormFieldInput,
                name: 'closedPrice',
                schema: {
                    label: 'Цена закрытия'
                },
                hidden: !isClosed,
                ...(isClosed ? {
                    validators: [
                        { name: 'required', options: { text: 'Заполните цену закрытия' } }
                    ]
                } : {})
            },
            {
                component: FormFieldInput,
                name: 'takeProfit',
                schema: {
                    label: 'Take profit'
                },
                validators: []
            },
            {
                component: FormFieldInput,
                name: 'stopLoss',
                schema: {
                    label: 'stopLoss'
                },
                validators: []
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
