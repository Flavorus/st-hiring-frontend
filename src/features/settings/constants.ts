export const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
] as const;

// Derived from CURRENCIES — keeps UI options and validation in sync
export const CURRENCY_VALUES = CURRENCIES.map((c) => c.value) as unknown as [
  'USD',
  'EUR',
  'GBP',
];

export type CurrencyCode = (typeof CURRENCY_VALUES)[number];
