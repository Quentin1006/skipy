const { transporterOpts } = require("../../../config");
const t = require("../transporter")(transporterOpts);



t.verifyTransporter()
    .then(res => console.log("Server ready to mail"))
    .catch(err => console.log(err));


console.log(t.getTransporter());