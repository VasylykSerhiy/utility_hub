const uk = {
  // MENU
  'MENU.LINK.DASHBOARD': 'Панель',
  'MENU.LINK.PROPERTY': 'Власність',

  // FORMS
  'FORM.PROPERTY.NAME': 'Назва',
  'FORM.PROPERTY.PLACEHOLDER': 'Введіть назву',
  'FORM.PLACEHOLDER.DATE': 'Виберіть дату',

  'FORM.ERROR.REQUIRED': "Це поле є обов'язковим",
  'FORM.ERROR.NON_NEGATIVE': "Значення має бути невід'ємним",
  'ERRORS.LOAD_FAILED': 'Не вдалося завантажити дані. Спробуйте ще раз.',

  // DASHBOARD
  'DASHBOARD.CARD.TITLE.TOTAL_COSTS': 'Загальні витрати',
  'DASHBOARD.CARD.TITLE.PENDING_READINGS': 'Очікувані показники',
  'DASHBOARD.CARD.VALUE.PENDING_READINGS': '{{count}} власності(ей)',
  'DASHBOARD.CARD.TITLE.ACTIVE_PROPERTIES': 'Активні власності',
  'DASHBOARD.CARD.TITLE.SPENDING_BREAKDOWN': 'Розподіл витрат',
  'DASHBOARD.CARD.TITLE.COST_BY_PROPERTY': 'Витрати за власністю',
  'DASHBOARD.CARD.TITLE.COST_TREND': 'Динаміка витрат за 6 місяців',

  // PROPERTY
  'PROPERTY.CREATE.TITLE': 'Створити власність',
  'PROPERTY.VIEW_ONLY': 'Лише перегляд',
  'PROPERTY.MEMBERS.TITLE': 'Учасники',
  'PROPERTY.MEMBERS.DESCRIPTION': 'Запрошуйте користувачів: Переглядач (лише перегляд) або Адмін (повний доступ). Керувати учасниками може лише власник об\'єкта.',
  'PROPERTY.MEMBERS.BY_EMAIL': 'За email',
  'PROPERTY.MEMBERS.BY_USER_ID': 'За ID користувача',
  'PROPERTY.MEMBERS.EMAIL_PLACEHOLDER': 'email@example.com',
  'PROPERTY.MEMBERS.USER_ID_PLACEHOLDER': 'ID (UUID)',
  'PROPERTY.MEMBERS.INVITE': 'Запросити',
  'PROPERTY.MEMBERS.NO_MEMBERS': 'Немає запрошених учасників',
  'PROPERTY.MEMBERS.EMAIL_REQUIRED': 'Введіть email',
  'PROPERTY.MEMBERS.USER_ID_REQUIRED': 'Введіть ID користувача',
  'PROPERTY.MEMBERS.INVITE_SUCCESS': 'Користувача запрошено',
  'PROPERTY.MEMBERS.INVITE_ERROR': 'Не вдалося запросити',
  'PROPERTY.MEMBERS.REMOVE_SUCCESS': 'Учасника видалено',
  'PROPERTY.MEMBERS.REMOVE_ERROR': 'Не вдалося видалити',
  'PROPERTY.MEMBERS.ROLE_VIEWER': 'Переглядач',
  'PROPERTY.MEMBERS.ROLE_ADMIN': 'Адмін (повний доступ)',
  'PROPERTY.MEMBERS.ROLE_UPDATE_SUCCESS': 'Роль оновлено',
  'PROPERTY.MEMBERS.ROLE_UPDATE_ERROR': 'Не вдалося оновити роль',
  'PROPERTY.MEMBERS.REMOVE_CONFIRM_TITLE': 'Видалити учасника?',
  'PROPERTY.MEMBERS.REMOVE_CONFIRM_MESSAGE': '{{name}} втратить доступ до цього об\'єкта.',
  'PROPERTY.MEMBERS.USER_NOT_FOUND': 'Користувача з таким email або ID не знайдено.',

  // AUDIT
  'AUDIT.TITLE': 'Журнал аудиту',
  'AUDIT.DESCRIPTION': 'Хто що змінив по цьому об\'єкту. Переглядати може лише власник.',
  'AUDIT.DATE': 'Дата',
  'AUDIT.USER': 'Користувач',
  'AUDIT.ACTION': 'Дія',
  'AUDIT.DETAILS': 'Деталі',
  'AUDIT.NO_ENTRIES': 'Записів аудиту ще немає.',
  'AUDIT.ACTION.property.create': 'Створено об\'єкт',
  'AUDIT.ACTION.property.update': 'Оновлено об\'єкт',
  'AUDIT.ACTION.property.delete': 'Видалено об\'єкт',
  'AUDIT.ACTION.reading.create': 'Додано показник',
  'AUDIT.ACTION.reading.update': 'Оновлено показник',
  'AUDIT.ACTION.reading.delete': 'Видалено показник',
  'AUDIT.ACTION.member.add': 'Запрошено учасника',
  'AUDIT.ACTION.member.remove': 'Видалено учасника',
  'AUDIT.ACTION.member.role_change': 'Змінено роль учасника',
  'AUDIT.ACTION_UNKNOWN': 'Дія',

  //MODALS
  'MODAL.CREATE_METER.TITLE': 'Додати показник',
  'MODAL.CREATE_METER.DESC': 'Введіть нові показання лічильника нижче.',
  'MODAL.CHANGE_TARIFF.TITLE': 'Змінити тариф',
  'MODAL.CHANGE_TARIFF.DESC':
    'Будь ласка, виберіть новий тариф і введіть початкові показання нижче. Тариф буде діяти з моменту зміни.',

  //MODAL ALERT
  'MODALS.ALERT.TITLE.REMOVE_PROPERTY': 'Видалити власність',
  'MODALS.ALERT.MESSAGE.REMOVE_PROPERTY':
    'Ви впевнені, що хочете видалити цю власність та всі пов’язані з нею дані? Цю дію неможливо скасувати.',
  'MODALS.ALERT.TITLE.DELETE_METER': 'Видалити лічильник',
  'MODALS.ALERT.MESSAGE.DELETE_METER':
    'Ви впевнені, що хочете видалити цей лічильник? Цю дію неможливо скасувати.',

  //TABLES
  'TABLE.NO_DATA': 'Немає даних',
  'TABLE.PAGINATION': 'Сторінка {{page}} з {{totalPages}}',
  'TABLE.LOADING': 'Завантаження',

  // BUTTONS
  'BUTTONS.SAVE': 'Зберегти',
  'BUTTONS.CANCEL': 'Скасувати',
  'BUTTONS.CREATE': 'Створити',
  'BUTTONS.EDIT': 'Редагувати',
  'BUTTONS.DELETE': 'Видалити',
  'BUTTONS.MORE': 'Більше',
  'BUTTONS.ADD_METER': 'Додати показник',
  'BUTTONS.CHANGE_TARIFF': 'Змінити тариф',
  'BUTTONS.PREVIOUS': 'Попередня',
  'BUTTONS.NEXT': 'Наступна',

  //MESSAGES
  'SCREENSHOT.SUCCESS': 'Зображення збережено в буфер обміну',

  //GLOBAL
  'ELECTRICITY.SINGLE': 'Однотарифний лічильник',
  'ELECTRICITY.DOUBLE': 'Двотарифний лічильник',
  FIXED_COSTS: 'Фіксовані витрати',
  COSTS: 'Вартість',
  NO_DATA: 'Немає даних',
  LOADING: 'Завантаження...',
  CURRENT_READING: 'Поточні показники',
  READING: 'Показники',
  DATE: 'Дата',
  CONSUMPTION: 'Спожито',
  METERS: 'Лічильники',
  METER: 'Лічильник',
  TOTAL: 'Всього',
  CHART: 'Діаграма',
  SEARCH: 'Пошук',
  ELECTRICITY: 'Світло',
  ELECTRICITY_DAY: 'Світло (День)',
  ELECTRICITY_NIGHT: 'Світло (Ніч)',
  ELECTRICITY_SELECT: 'Тип лічильника електроенергії',
  /** UA: Секція заміни лічильника. EN: Meter replacement section. */
  METER_REPLACEMENT: 'Заміна лічильника',
  METER_REPLACEMENT_HINT: 'Якщо цей показ — після заміни лічильника, вкажіть початкове значення нового (зазвичай 0) та за потреби останній показ старого.',
  METER_REPLACEMENT_BASELINE: 'Початкове значення нового лічильника',
  METER_REPLACEMENT_OLD_FINAL: 'Остаточний показ старого лічильника',
  WATER: 'Вода',
  GAS: 'Газ',
  INTERNET: 'Інтернет',
  FIXED: 'Фіксовані',
  MAINTENANCE: 'Обслуговування',
  GAS_DELIVERY: 'Поставка газу',
  TARIFF: 'Тариф',
  TARIFFS: 'Тарифи',
  HISTORY: 'Історія',
  KWN: 'кВт·год',
  M3: 'м³',
};

export default uk;
