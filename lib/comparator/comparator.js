

const isNumber = (n) => (!isNaN(parseFloat(n)) && isFinite(n));

const isBoolean = (n) => (typeof n == typeof true);
  

const comparator = (a, b) => {
    if(isBoolean(a) || isBoolean(b)){
        return a === b;
    }

    else if(isNumber(a) || isNumber(b)){
        return Number(a) === Number(b)
    }
    else {
        return a.includes(b) || b.includes(a)
    }
}

module.exports = comparator;