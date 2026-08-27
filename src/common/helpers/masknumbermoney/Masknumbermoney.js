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
   * Strips anything that isn't a digit, so a value copied/pasted with
   * unexpected separators (e.g. from Excel) never gets mistaken for a
   * decimal or thousands separator.
   * @param {string} v
   */
  static onlyDigits(v) {
    return v.replace(/\D/g, '');
  }

  /**
   *
   * @param {number} v
   * @param {typeof Args | undefined} args
   */
  static formatToMask(v, args = {}) {
    if (v === undefined) v = 0;
    if (typeof v === 'string') v = Masknumbermoney.onlyDigits(v);
    const options = { ...Args, ...args };
    /**
     * @type {string}
     */
    let format = SimpleMaskMoney.formatToMask(
      typeof v === 'number' ? parseInt(v) : v,
      options
    );

    if (!options.fractionDigits)
      format =
        !options.fractionDigits && format.replace(options.decimalSeparator, '');
    return format;
  }

  /**
   *
   * @param {string} v
   * @param {*} arg
   */
  static formatToNumber(v, arg = {}) {
    if (v === 'N/A') return 0;
    if (typeof v === 'string') v = Masknumbermoney.onlyDigits(v);
    return SimpleMaskMoney.formatToNumber(v, { ...Args, ...arg });
  }
}

window.Masknumbermoney = Masknumbermoney;

export default Masknumbermoney;
