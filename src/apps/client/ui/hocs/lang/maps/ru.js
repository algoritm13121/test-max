/* eslint-disable max-len */

export default {
    content: {
        title: 'Контент',
        langs: 'Выбор языка'
    },
    footer: {
        operations: "Операции",
        openPosition: "Открытые позиции",
        closePosition: "Закрытые позиции",
        pu: "П/У:",
        balance: "Баланс:",
        bonuses: "Бонусы:",
        credFacilities: "Крд. Средства:",
        marginLevel: "Уровень маржи:",
        facilities: "Средства:",
        pledge: "Залог:",
        free: "Свободные:"
    },
    header: {
        timeFormat: 'UTC',
        buy: 'Купить',
        sell: 'Продать',
        deposit: 'Депозит'
    },
    authorizationPanel: {
        signIn: 'Войти',
        signUp: 'Регистрация'
    },
    confirmPopup: {
        confirm: 'Подтвердите ',
        assets: 'Актив:',
        size: 'Объем:',
        rate: 'Курс:',
        amount: 'Сумма:',
        confirmButton: 'Подтвердить',
        purchase: 'Покупка',
        sale: 'Продажа',
        successTitle: ' успешно совершена',
        confirmPurchase: 'покупку',
        confirmSale: 'продажу',
        failedBalance: 'Недостаточно средств',
        failedIncorrect: 'Некорректные данные',
        failedDay: 'Этот рынок не работает в выходные',
        takeProfit: 'Take profit',
        stopLoss: 'Stop loss',
        inputsName: 'Take profit & Stop loss'
    },
    menu: {
        actives: {
            crypto: "Криптовалюты",
            currencies: "Валюты",
            products: "Товары",
            shares: "Акции",
            indices: "Индексы"
        },
        menuTitleOpen: "Меню",
        menuTitleClose: "Закрыть",
        assets: "Активы",
        chartTimeframe: "Временная шкала",
        chart: "Вид графика",
        account: "Мой аккаунт",
        chat: "Чат",
        deposit: "Депозит",
        logOut: "Выйти",
        currency: "Валюты",
        assetsSearch: "Поиск активов",
        assetsTitle: "Активы",
        onMainPage: "На главную",
        timingScaleValue: [
            { id: 1, label: '1', value: '1' },
            { id: 2, label: '5', value: '5' },
            { id: 3, label: '15', value: '15' },
            { id: 4, label: '30', value: '30' },
            { id: 5, label: '1h', value: '60' },
            { id: 6, label: '1d', value: 'D' },
            { id: 7, label: '1w', value: 'W' },
            { id: 8, label: '1m', value: 'M' }
        ],
        language: 'Язык'
    },
    cookiesAgreement: {
        text: 'Наш сайт использует файлы cookie',
        agree: 'Ок'
    },
    auth: {
        inputs: {
            email: {
                placeholder: 'Почта',
                validator: 'Введите Вашу почту'
            },
            password: {
                placeholder: 'Пароль',
                validator: 'Минимум 8 символов'
            },
            name: {
                placeholder: 'Имя',
                validator: 'Введите Ваше имя'
            },
            surname: {
                placeholder: 'Фамилия',
                validator: 'Введите Вашу фамилию'
            },
            phone: {
                placeholder: 'Номер телефона',
                validator: 'Введите Ваш номер телефона'
            },
            date: {
                placeholder: 'Дата рождения',
                validator: 'Введите Вашу дату рождения'
            },
            city: {
                placeholder: 'Город',
                validator: 'Введите Ваш город'
            },
            address: {
                placeholder: 'Адрес',
                validator: 'Введите Ваш адрес'
            },
            gender: {
                placeholder: 'Пол',
                validator: 'Выберите пол'
            },
            country: {
                placeholder: 'Страна',
                validator: 'Выберите страну'
            },
            accountNumber: {
                placeholder: 'Номер счета',
                validator: 'Введите номер счета'
            },
            newPassword: {
                placeholder: 'Новый пароль',
                validator: 'Минимум 8 символов'
            },
            confirmPassword: {
                placeholder: 'Подтвердить пароль',
                validator: 'Пароль не совпадает'
            }
        },
        errorPromo: "Неверный промокод",
        errorWrongPassOrLogin: "Неправильное имя пользователя или пароль",
        errorBlocked: "Ваш аккаунт был заблокирован",
        signIn: "Войти",
        signUp: "Регистрация",
        forgetPassword: "Забыли пароль?",
        isLogin: "Является логином",
        passwordRevovery: "Восстановление пароля",
        newPassword: "Отправить новый пароль",
        back: "Назад",
        getUpdates: "Я хочу получать обновления",
        iAccept: "Я принимаю ",
        termsOfAgreement: "условия соглашения",
        addressBotomLabel: "Улица, дом, квартира",
        clear: "Очистить",
        save: "Сохранить",
        titleReset: "Ваш запрос на востановление пароля успешно выполнен"
    },
    accountInfo: {
        navbar: {
            privateData: 'Персональные данные',
            documents: 'Документы',
            transaction: 'Транзакции',
            tradeHistory: 'Торговая история'
        },
        documents: {
            personality: 'Подтверждения личности',
            clickOrDrag: 'Нажмите или перетащите файл для загрузки',
            address: 'Подтверждения места жительства',
            creditFrontSide: 'Кредитная карта (лицевая сторона)',
            creditBackSide: 'Кредитная карта (обратная сторона)',
            anotherDocuments: 'Другие документы',
            loadButton: 'Загрузить'
        },
        transaction: {
            processing: 'В обработке',
            executed: 'Выполнен',
            canceled: 'Отменен',
            moneyWithdrawal: 'Вывести',
            inputPlaceholder: 'Вывод от $ 5.00',
            summ: 'Сумма',
            status: 'Описание',
            date: 'Дата',
            moneyWithdrawalTitle: 'Вывод средств',
            error: {
                failedBalance: 'Недостаточно средств',
                failedMinValue: 'Некорректные данные'
            }
        },
        tradeHistory: {
            dateTitle: 'Дата создания',
            dateCloseTitle: 'Дата закрытия',
            assetTitle: 'Актив',
            amountTitle: 'Объем',
            pledgeTitle: 'Залог',
            openingRateTitle: 'Курс открытия',
            closingRateTitle: 'Курс закрытия',
            profitTitle: 'Прибыль',
            commissionTitle: 'Комиссия',
            takeProfit: 'Take profit',
            stopLoss: 'Stop loss',
            closingDate: 'Время закрытия'
        },
        dataInfo: {
            gender: {
                male: 'Мужской',
                female: 'Женский'
            }
        },
        countryInfo: {
            ru: 'Russia (Россия)',
            lv: 'litva (Литва)',
            td: 'Tilda (Литdgdsва)',
            AS: 'American Samoa',
            AR: 'Argentina ',
            AU: 'Australia  ',
            AT: 'Austria',
            BR: 'Brazil',
            IO: 'British Indian Ocean Territory',
            VG: 'British Virgin Islands VG',
            BG: 'Bulgaria ',
            CA: 'Canada  ',
            CL: 'Chile ',
            CY: 'Cyprus',
            CZ: 'Czech Republic',
            DK: 'Denmark',
            EE: 'Estonia',
            FI: 'Finland',
            FR: 'France',
            GE: 'Georgia',
            DE: 'Germany',
            GR: 'Greece',
            HK: 'Hong Kong',
            HU: 'Hungary',
            IS: 'Iceland',
            IE: 'Ireland',
            IT: 'Italy',
            JP: 'Japan',
            LV: 'Latvia',
            LI: 'Liechtenstein',
            LT: 'Lithuania',
            LU: 'Luxembourg',
            MO: 'Macau',
            MT: 'Malta',
            MD: 'Moldova',
            MC: 'Monaco ',
            ME: 'Montenegro',
            NL: 'Netherlands',
            NZ: 'New Zealand',
            NO: 'Norway',
            PA: 'Panama',
            PL: 'Poland',
            PT: 'Portugal',
            QA: 'Qatar',
            SA: 'Saudi Arabia',
            SG: 'Singapore',
            SI: 'Slovakia',
            SK: 'Slovenia ',
            ZA: 'South Africa',
            SS: 'South Korea',
            ES: 'Spain',
            SE: 'Sweden ',
            CH: 'Switzerland ',
            TW: 'Taiwan ',
            TH: 'Thailand ',
            UAE: 'United Arab Emirates',
            GB: 'United Kingdom',
            US: 'United States',
            VN: 'Vietnam',
            by: 'Belarus (Беларусь)'
        }
    },
    payments: {
        qiwi: {
            title: 'QIWI payment'
        },
        bitcoin: {
            title: 'Bitcoin'
        },
        visa: {
            title: 'Payment gateway',
            subtitle: 'Visa/Mastercard'
        },
        replenishment: 'Выберите способ пополнения',
        info: {
            bitcoinTopTitle: 'Наш биткоин адрес',
            adress: '1BQ9qza7fn9snSCyJQB3ZcN46biBtkt4ee',
            adressBottomTitle: 'После проведения транзакции свяжитесь с нашим менеджером',
            copied: 'Скопировано',
            qiwiTopTitle: 'Сумма пополнения',
            failedIncorrect: 'Некорректные данные'
        }
    },
    withdrawSuccess: {
        topTitle: 'Ваш запрос на вывод $ ',
        success: 'успешно',
        sended: 'отправлен',
        bottomTitle: 'Средства поступят на счет в течении 3-х дней'
    },
    openedOrders: {
        createData: "Дата создания",
        active: "Актив",
        value: "Объем",
        pledge: "Залог",
        opCourse: "Курс открытия",
        nowCourse: "Текущий курс",
        profit: "Прибыль",
        commission: "Комиссия",
        takeProfit: "Зафиксировать прибыль",
        stopLoss: "Остановить потери",
        closingDate: "Дата закрытия",
        closingTime: "Время закрытия"
    },
    openOrder: {
        accept: "Подтвердить",
        some: "Что то"
    },
    chat: {
        title: "Чат",
        inputPlaceholder: "Введите сообщение"
    }

};
