const hbs = require("express-handlebars");
const path = require("path");

class TemplateEngine {

    constructor(opts){
        this.viewEngine = hbs.create(opts.viewEngine ||  {});
        this.viewPath = opts.viewPath;
        this.ext = opts.extName || ".hbs";

        if(!this.viewPath){
            throw new Error("You have to provide a path for templates")
        }

        this.renderView = this.renderView.bind(this);
    }


    renderView(tplPath, context){
        return new Promise((resolve, reject) => {
            this.viewEngine.renderView(tplPath, context, (err, html) => {
                if (err) return reject(err);
                resolve(html);
            })
        })
    }


    createTemplate(tplFile, context){
        const tplPath = path.resolve(this.viewPath, `${tplFile}${this.ext}`);
        return this.renderView(tplPath, context);
    }
}


module.exports = TemplateEngine