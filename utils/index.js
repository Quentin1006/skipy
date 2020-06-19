exports.str = (el) => (""+el);

exports.deepCopy = (obj) => (JSON.parse(JSON.stringify(obj)));

exports.shallowCopy = (obj) => {
    const type = obj.constructor.name;
    switch(type){
        case "Array":
            return obj.slice(0);
        case "Object":
            return Object.assign({}, obj);
        default:
            return obj;
    }

}

exports.isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'