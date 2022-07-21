const allEndpoints = {}

module.exports = async (endpointsOptions) => {
    let {
        endpoints,
    } = endpointsOptions

    // Ensure the endpoints and aliases are in an array
    if (typeof endpoints === 'string') {
        endpoints = [endpoints]
    }

    //console.log(`Registering command "${endpoints[0]}"`)

    for(const endpoint of endpoints){
        allEndpoints[endpoint] = {
        ...endpointsOptions,
        endpoints
        }
    }
}

module.exports.listen = async (app, admin) => {

    //get method
    app.get('/api/auth', async (req, res) => {
        
        const endpoint = allEndpoints['auth']
        if(!endpoint){
            return
        }

        const {
            callback,
        } = endpoint

        await callback(admin, app, req, res)

    })
}