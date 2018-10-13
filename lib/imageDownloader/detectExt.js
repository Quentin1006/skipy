module.exports = (buffer) => {
    let totalBytes = 4;
    const signature = []
    for (const byte of buffer) {
        console.log(byte.toString(16).toUpperCase());
        if(totalBytes-- <= 0){
            break;
        }
        signature.push(byte.toString(16).toUpperCase());
    }

    return getExtType(signature.join(""));
}



const getExtType = (signature) => {
    switch (signature) {
        case '89504E47':
            return '.png'
        case '47494638':
            return '.gif'
        case '25504446':
            return '.pdf'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
            return '.jpg'
        case '504B0304':
            return '.zip'
        default:
            return ''
    }
}