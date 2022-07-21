module.exports = {
    endpoints: 'auth',
    callback: async (admin, app, req, res) => {

        //setting up the db firestore
        const db = admin.firestore()
        if(req.query.authType.toLowerCase() == 'eg1' || req.query.authType.toLowerCase() == 'ios' || req.query.authType.toLowerCase() == 'lac2'){
            const authTypeCredentialResponse = await db.collection("authTokens").doc(req.query.authType.toLowerCase()).get()

            //check token status
            if(authTypeCredentialResponse.data().api.status === 200){

                //request status
                res.status(authTypeCredentialResponse.data().api.status)

                //response data
                res.json({
                    status: authTypeCredentialResponse.data().api.status,
                    data: {
                        lastModified: authTypeCredentialResponse.data().api.lastModified,
                        authType: authTypeCredentialResponse.data().api.authType,
                        token: authTypeCredentialResponse.data().api.tokenData
                    }
                })
            }else{

                //request status
                res.status(authTypeCredentialResponse.data().api.status)
            
                //response data
                res.json({
                    status: authTypeCredentialResponse.data().api.status,
                    data: {
                        lastModified: authTypeCredentialResponse.data().api.lastModified,
                        authType: authTypeCredentialResponse.data().api.authType,
                        error: authTypeCredentialResponse.data().api.errorData
                    }
                })
            }
        }else if(Object.keys(req.query).includes('authType') && req.query.authType.length !== 0){

            //request status
            res.status(400)

            //response data
            res.json({
                status: 400,
                error: `The query parameter of authType ${req.query.authType} is not valid`,
                validAuthTypes: [
                    'eg1',
                    'PC',
                    'lac2',
                ]
            })

        }else if(Object.keys(req.query).includes('authType') && req.query.authType.length === 0){

            //request status
            res.status(400)

            //response data
            res.json({
                status: 400,
                error: `No authType has been provided`,
                pleaseProvideOneOfTheseTypes: [
                    'eg1',
                    'PC',
                    'lac2',
                ]
            })

        }else{

            //request status
            res.status(400)

            //response data
            res.json({
                status: 400,
                error: "No supported query parameters has been set",
                supportedParamerters: [
                    'authType'
                ],
                validAuthTypes: [
                    'eg1',
                    'PC',
                    'lac2',

                ]
            })
        }
    }
}