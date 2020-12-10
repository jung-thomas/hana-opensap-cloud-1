const cds = require('@sap/cds')
const Sdk = require('@dynatrace/oneagent-sdk')
const DynaT = Sdk.createInstance()
const proxy = require('@sap/cds-odata-v2-adapter-proxy')
console.log(DynaT.getCurrentState())
console.log(`CDS Custom Boostrap from /srv/server.js`)
global.__base = __dirname + "/"
process.on('uncaughtException', function (err) {
    console.error(err.name + ': ' + err.message, err.stack.replace(/.*\n/, '\n')) // eslint-disable-line
})

const TextBundle = require("@sap/textbundle").TextBundle
// global.__bundle = new TextBundle("../_i18n/i18n", require("./utils/locale").getLocale())


// cds.on('bootstrap', app => app.use(proxy()));
cds.on('bootstrap', app => app.use(proxy({ services: { "/MasterDataService/": "MasterDataService", "/POService/": "POService" } })))
cds.on('served', () => {
    // add more middleware after all cds servies
})


// delegate to default server.js:
module.exports = async (o) => {
    o.port = process.env.PORT || 4004
    //API route (Disabled by default)
    // o.baseDir = process.cwd()
    o.baseDir = global.__base;
    o.routes = []

    const express = require('express')
    let app = express()
    app.express = express
    // app.baseDir = process.cwd()
    app.baseDir = o.baseDir;
    o.app = app
    const path = require('path')
    const fileExists = require('fs').existsSync
    let expressFile = path.join(app.baseDir, 'server/express.js')
    if (fileExists(expressFile)) {
        await require(expressFile)(app)
    }

    // //V2 fallback
    // cds.serve('POService')
    //     .from(global.__base + "/gen/csn.json")
    //     .to("fiori")
    //     .at('/POService').in(app)
    //     .catch((err) => {
    //         app.logger.error(err);
    //     })

    // cds.serve('MasterDataService')
    //     .from(global.__base + "/gen/csn.json")
    //     .to("fiori")
    //     .at('/MasterDataService').in(app)
    //     .catch((err) => {
    //         app.logger.error(err);
    //     })

    o.app.httpServer = await cds.server(o)

    const glob = require('glob')
    //Load routes
    // let baseDir = process.cwd()
    let routesDir = path.join(global.__base, 'routes/**/*.js')
    let files = glob.sync(routesDir)
    this.routerFiles = files;
    if (files.length !== 0) {
        for (let file of files) {
            await require(file)(app, app.httpServer)
        }
    }


    return o.app.httpServer
}

// const cds = require("@sap/cds");
// const proxy = require("@sap/cds-odata-v2-adapter-proxy");

// cds.on("bootstrap", app => app.use(proxy()));

// module.exports = cds.server;