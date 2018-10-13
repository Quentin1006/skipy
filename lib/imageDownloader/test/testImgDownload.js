const { downloadImage } = require("../");

const url = "https://cdn.pixabay.com/photo/2016/11/14/22/18/beach-1824855_960_720.jpg";

downloadImage(url, {})
.then(res => { 
    console.log(res)
});