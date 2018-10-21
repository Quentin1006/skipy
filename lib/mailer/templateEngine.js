const hbs = require("express-handlebars");
const path = require("path");

class templateEngine {
    
    constructor(opts){
        this.viewEngine = hbs.create(opts.viewEngine ||  {});
        this.viewPath = opts.viewPath;
        this.ext = opts.extName || ".hbs";

        if(!this.viewPath){
            throw new Error("You have to provide a path for templates")
        }

        this.renderView = this.renderView.bind(this);
    }


    async renderView(tplPath, context){
        let html = "";
        await new Promise((resolve, reject) => {
            this.viewEngine.renderView(tplPath, context, (err, body) => {
                if (err) reject(err);
                resolve(body);
            })
        }).then(content => {
            html = content;
        });
        return html;
    }


    async createTemplate(tplFile, context){
        const tplPath = path.resolve(this.viewPath, `${tplFile}${this.ext}`);
        return await this.renderView(tplPath, context);
    }
}


module.exports = templateEngine