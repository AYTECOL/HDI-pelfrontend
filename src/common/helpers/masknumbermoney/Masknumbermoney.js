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
        if (v === undefined) v = 0;
        v = parseInt(v);
        let format = SimpleMaskMoney.formatToMask(v, Args).split(",")[0];
        return format === "$0." ? '$0' : format;
    }

    static formatToNumber(v) {
        return SimpleMaskMoney.formatToNumber(v, Args);
    }

}

export default Masknumbermoney;