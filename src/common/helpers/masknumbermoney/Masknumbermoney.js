import SimpleMaskMoney from 'simple-mask-money';

/**
 * @typedef {typeof Args} SimpleMaskMoney
 */
const Args = {
  allowNegative: false,
  negativeSignAfter: false,
  prefix: '$',
  suffix: '',
  fixed: true,
  fractionDigits: 0,
  decimalSeparator: ',',
  thousandsSeparator: '.',
  cursor: 'end',
};

class Masknumbermoney {
  /**
   *
   * @param {number} v
   * @param {typeof Args | undefined} args
   */
  static formatToMask(v, args = {}) {
    if (v === undefined) v = 0;
    const options = { ...Args, ...args };
    /**
     * @type {string}
     */
    let format = SimpleMaskMoney.formatToMask(v, options);

    if (!options.fractionDigits)
      format =
        !options.fractionDigits && format.replace(options.decimalSeparator, '');
    return format;
  }

  static formatToNumber(v, arg) {
    return SimpleMaskMoney.formatToNumber(v, { ...Args, ...arg });
  }
}

export default Masknumbermoney;
