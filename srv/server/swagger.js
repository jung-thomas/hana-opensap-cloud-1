
function swagger(app) {

    this.getOpenAPI = async () => {
        let swaggerJSDoc = require('swagger-jsdoc')

        var options = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'HANA Cloud openSAP 2020',
                    version: '1.0.0',
                    "x-odata-version": '4.0'
                },
            },
            apis: ['./srv/routes/*']
        }
        var swaggerSpec = swaggerJSDoc(options)
        swaggerSpec.components.requestBodies = []
        return swaggerSpec;
        // try {
        //     const cds = require("@sap/cds")
        //     const csn = await cds.load([global.__base + "/gen/csn.json"])
        //     await convertEdmxToOpenAPI(csn, 'MasterDataService', '/odata/v4/MasterDataService', swaggerSpec)
        //    // await convertEdmxToOpenAPI(csn, 'POService', '/odata/v4/POService', swaggerSpec)            
        //     return swaggerSpec 
        // } catch (error) {
        //     app.logger.error(error)
        //     return
        // }
    }

}
module.exports = swagger