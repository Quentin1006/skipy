const { downloadImage } = require("../");

const url = "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png";

downloadImage(url, {})
.then(res => { 
    console.log(res)
});