import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldDate from '../Form/fields/FormFieldDate/FormFieldDate';
import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';

export default function ({ data: { title } = {} } = {}) {
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
                component: FormFieldDate,
                name: 'closedAt',
                schema: {
                    label: 'Дата закрытия ордера'
                },
                type: 'datetime-local',
                validators: [
                    { name: 'required', options: { text: 'Выберите дату закрытия' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'closedPrice',
                schema: {
                    label: 'Цена закрытия'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните цену закрытия' } },
                    { name: 'isNumber' }
                ]
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
