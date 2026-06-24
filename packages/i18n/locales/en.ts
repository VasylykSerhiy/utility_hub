const en = {
  // MENU
  'MENU.LINK.DASHBOARD': 'Dashboard',
  'MENU.LINK.PROPERTY': 'Property',

  // FORMS
  'FORM.PROPERTY.NAME': 'Name',
  'FORM.PROPERTY.PLACEHOLDER': 'Enter property name',
  'FORM.PLACEHOLDER.DATE': 'Select a date',

  'FORM.ERROR.REQUIRED': 'This field is required',
  'FORM.ERROR.NON_NEGATIVE': 'Value must be non-negative',
  'ERRORS.LOAD_FAILED': 'Failed to load data. Please try again.',

  // DASHBOARD
  'DASHBOARD.CARD.TITLE.TOTAL_COSTS': 'Total Costs',
  'DASHBOARD.CARD.TITLE.PENDING_READINGS': 'Pending Readings',
  'DASHBOARD.CARD.VALUE.PENDING_READINGS': '{{count}} Property(ies)',
  'DASHBOARD.CARD.TITLE.ACTIVE_PROPERTIES': 'Active Properties',
  'DASHBOARD.CARD.TITLE.SPENDING_BREAKDOWN': 'Spending Breakdown',
  'DASHBOARD.CARD.TITLE.COST_BY_PROPERTY': 'Cost by Property',
  'DASHBOARD.CARD.TITLE.COST_TREND': '6-Month Cost Trend',

  // PROPERTY
  'PROPERTY.CREATE.TITLE': 'Create New Property',
  'PROPERTY.VIEW_ONLY': 'View only',
  'PROPERTY.MEMBERS.TITLE': 'Members',
  'PROPERTY.MEMBERS.DESCRIPTION': 'Invite users: Viewer (read-only) or Admin (full access). Only the property owner can manage members.',
  'PROPERTY.MEMBERS.BY_EMAIL': 'By email',
  'PROPERTY.MEMBERS.BY_USER_ID': 'By user ID',
  'PROPERTY.MEMBERS.EMAIL_PLACEHOLDER': 'email@example.com',
  'PROPERTY.MEMBERS.USER_ID_PLACEHOLDER': 'User ID (UUID)',
  'PROPERTY.MEMBERS.INVITE': 'Invite',
  'PROPERTY.MEMBERS.NO_MEMBERS': 'No invited members',
  'PROPERTY.MEMBERS.EMAIL_REQUIRED': 'Enter email',
  'PROPERTY.MEMBERS.USER_ID_REQUIRED': 'Enter user ID',
  'PROPERTY.MEMBERS.INVITE_SUCCESS': 'User invited',
  'PROPERTY.MEMBERS.INVITE_ERROR': 'Failed to invite',
  'PROPERTY.MEMBERS.REMOVE_SUCCESS': 'Member removed',
  'PROPERTY.MEMBERS.REMOVE_ERROR': 'Failed to remove',
  'PROPERTY.MEMBERS.ROLE_VIEWER': 'Viewer',
  'PROPERTY.MEMBERS.ROLE_ADMIN': 'Admin (full access)',
  'PROPERTY.MEMBERS.ROLE_UPDATE_SUCCESS': 'Role updated',
  'PROPERTY.MEMBERS.ROLE_UPDATE_ERROR': 'Failed to update role',
  'PROPERTY.MEMBERS.REMOVE_CONFIRM_TITLE': 'Remove member?',
  'PROPERTY.MEMBERS.REMOVE_CONFIRM_MESSAGE': '{{name}} will lose access to this property.',
  'PROPERTY.MEMBERS.USER_NOT_FOUND': 'User with this email or ID was not found.',

  // AUDIT
  'AUDIT.TITLE': 'Audit log',
  'AUDIT.DESCRIPTION': 'Who changed what on this property. Only the owner can view.',
  'AUDIT.DATE': 'Date',
  'AUDIT.USER': 'User',
  'AUDIT.ACTION': 'Action',
  'AUDIT.DETAILS': 'Details',
  'AUDIT.NO_ENTRIES': 'No audit entries yet.',
  'AUDIT.ACTION.property.create': 'Created property',
  'AUDIT.ACTION.property.update': 'Updated property',
  'AUDIT.ACTION.property.delete': 'Deleted property',
  'AUDIT.ACTION.reading.create': 'Added meter reading',
  'AUDIT.ACTION.reading.update': 'Updated meter reading',
  'AUDIT.ACTION.reading.delete': 'Deleted meter reading',
  'AUDIT.ACTION.member.add': 'Invited member',
  'AUDIT.ACTION.member.remove': 'Removed member',
  'AUDIT.ACTION.member.role_change': 'Changed member role',
  'AUDIT.ACTION_UNKNOWN': 'Action',

  //MODALS
  'MODAL.CREATE_METER.TITLE': 'Add New Meter',
  'MODAL.CREATE_METER.DESC': 'Please enter the new meter readings below.',
  'MODAL.CHANGE_TARIFF.TITLE': 'Change Tariff',
  'MODAL.CHANGE_TARIFF.DESC':
    'Please select the new tariff and enter the starting readings below. The tariff will take effect from the moment of change.',

  //MODAL ALERT
  'MODALS.ALERT.TITLE.REMOVE_PROPERTY': 'Delete Property',
  'MODALS.ALERT.MESSAGE.REMOVE_PROPERTY':
    'Are you sure you want to delete this property and all its associated data? This action cannot be undone.',
  'MODALS.ALERT.TITLE.DELETE_METER': 'Delete Meter',
  'MODALS.ALERT.MESSAGE.DELETE_METER':
    'Are you sure you want to delete this meter? This action cannot be undone.',

  //TABLES
  'TABLE.NO_DATA': 'No data',
  'TABLE.PAGINATION': 'Page {{page}} of {{totalPages}}',
  'TABLE.LOADING': 'Loading',

  // BUTTONS
  'BUTTONS.SAVE': 'Save',
  'BUTTONS.CANCEL': 'Cancel',
  'BUTTONS.CREATE': 'Create',
  'BUTTONS.EDIT': 'Edit',
  'BUTTONS.DELETE': 'Delete',
  'BUTTONS.MORE': 'More',
  'BUTTONS.ADD_METER': 'Add Meter',
  'BUTTONS.CHANGE_TARIFF': 'Change Tariff',
  'BUTTONS.PREVIOUS': 'Previous',
  'BUTTONS.NEXT': 'Next',

  //MESSAGES
  'SCREENSHOT.SUCCESS': 'Screenshot saved successfully!',

  //GLOBAL
  'ELECTRICITY.SINGLE': 'Single Tariff Meter',
  'ELECTRICITY.DOUBLE': 'Double Tariff Meter',
  FIXED_COSTS: 'Fixed Costs',
  COSTS: 'Costs',
  NO_DATA: 'No data available',
  LOADING: 'Loading...',
  CURRENT_READING: 'Current Reading',
  CONSUMPTION: 'Consumption',
  READING: 'Reading',
  DATE: 'Date',
  METERS: 'Meters',
  METER: 'Meter',
  TOTAL: 'Total',
  CHART: 'Chart',
  SEARCH: 'Search',
  ELECTRICITY: 'Electricity',
  ELECTRICITY_DAY: 'Electricity (Day)',
  ELECTRICITY_NIGHT: 'Electricity (Night)',
  ELECTRICITY_SELECT: 'Electricity Meter Type',
  METER_REPLACEMENT: 'Meter replacement',
  METER_REPLACEMENT_HINT: 'If this reading is after a meter replacement, enter the new meter start value (usually 0) and optionally the old meter final reading.',
  METER_REPLACEMENT_BASELINE: 'New meter start value',
  METER_REPLACEMENT_OLD_FINAL: 'Old meter final reading',
  WATER: 'Water',
  GAS: 'Gas',
  INTERNET: 'Internet',
  FIXED: 'Fixed',
  MAINTENANCE: 'Maintenance',
  GAS_DELIVERY: 'Gas Delivery',
  TARIFF: 'Tariff',
  TARIFFS: 'Tariffs',
  HISTORY: 'History',
  KWN: 'kWh',
  M3: 'm³',
};

export default en;
