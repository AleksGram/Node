const { join } = require("path");
const nunjucks = require("nunjucks");

exports.useTemplates = (templateModuleName, server) => {
    const TEMPLATES = join(__dirname, "templates_module/templates");

    server.set('views', TEMPLATES)
    console.log(templateModuleName)

    if (templateModuleName === "nunjucks") {
        nunjucks.configure(TEMPLATES, {
            autoescape: false,
            express: server,
            watch: true,
        });
    } else {
        server.set("view engine", templateModuleName);
    }

}