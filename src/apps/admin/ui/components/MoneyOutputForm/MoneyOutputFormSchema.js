import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldRadios from '../Form/fields/FormFieldRadios/FormFieldRadios';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';

export default function ({ data: { title, name, date, amount } = {} } = {}) {
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
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'name',
                schema: {
                    label: `Имя: ${name}`,
                    variant: 'body1'
                }
            },
            {
                component: FormFieldTitle,
                name: 'date',
                schema: {
                    label: `Дата запроса: ${date}`,
                    variant: 'body1'
                }
            },
            {
                component: FormFieldTitle,
                name: 'amount',
                schema: {
                    label: `Сума запроса: ${amount}`,
                    variant: 'body1'
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'titleType',
                schema: {
                    label: 'Статус обработки',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldRadios,
                name: 'status',
                schema: {
                    label: 'Статус',
                    options: [
                        { label: 'Новый', value: 'new' },
                        { label: 'В обработке', value: 'progress' },
                        { label: 'Выполнен', value: 'done' },
                        { label: 'Отказано', value: 'rejected' }
                    ]
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
