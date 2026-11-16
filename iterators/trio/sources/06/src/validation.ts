import type { FormEvent, InvalidEvent } from 'react';

export function localizeValidation(event: InvalidEvent<HTMLElement>, translate: (cs: string, en: string) => string) {
  const field = event.target as HTMLInputElement;
  if (!field.setCustomValidity) return;
  const message = field.validity.valueMissing
    ? translate('Vyplňte prosím toto pole.', 'Please fill in this field.')
    : field.validity.typeMismatch
      ? translate('Zadejte prosím platný e-mail.', 'Please enter a valid email address.')
      : field.validity.rangeOverflow || field.validity.rangeUnderflow || field.validity.stepMismatch
        ? translate('Zvolte hodnotu v povoleném rozsahu.', 'Choose a value in the allowed range.')
        : translate('Zkontrolujte prosím zadanou hodnotu.', 'Please check the value you entered.');
  field.setCustomValidity(message);
}
export function clearValidation(event: FormEvent<HTMLElement>) {
  const field = event.target as HTMLInputElement;
  if (field.setCustomValidity) field.setCustomValidity('');
}
