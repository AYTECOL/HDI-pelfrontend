import Helpers from './Helpers';

it('test toCapitalize', () => {
  expect(typeof Helpers.toCapitalize('test words')).toBe('string');
});

it('test hasClass', () => {
  expect(Helpers.hasClass('body', 'body')).toBe(false);
});

it('test addClass', () => {
  expect(Helpers.addClass('body', 'body')).toBe(undefined);
});

it('test removeClass', () => {
  expect(Helpers.removeClass('body', 'body')).toBe(undefined);
});

it('test scrollToElement', () => {
  expect(Helpers.scrollToElement('body')).toBe(undefined);
});

it('test calcularDigitoVerificacion', () => {
  expect(typeof Helpers.calcularDigitoVerificacion(101043159)).toBe('number');
});
