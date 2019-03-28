import SimpleMaskMoney from "simple-mask-money";

const Args = {
    allowNegative: false,
    negativeSignAfter: false,
    prefix: '$',
    suffix: '',
    fixed: true,
    fractionDigits: 0,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    cursor: 'end'
};

class Masknumbermoney {

    static formatToMask(v) {
        return SimpleMaskMoney.formatToMask(v, Args).split(",")[0];
    }

    static formatToNumber(v) {
        return SimpleMaskMoney.formatToNumber(v, Args).split(",")[0];
    }

}

export default Masknumbermoney;



