import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldSelect from '../Form/fields/FormFieldSelect/FormFieldSelect';

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
                component: FormFieldSelect,
                name: 'type',
                schema: {
                    label: 'Тип',
                    options: [
                        { name: 'Депозит', value: 'deposit' },
                        { name: 'Крд. Средства', value: 'credFacilities' },
                        { name: 'Бонусы', value: 'bonuses' }
                    ]
                },
                validators: [
                    { name: 'required', options: { text: 'Не выбран тип' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'value',
                schema: {
                    label: 'Сумма транзакции'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните сумму транзакции' } },
                    { name: 'isNumber' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'content',
                schema: {
                    label: 'Описание транзакции',
                    multiline: true
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
