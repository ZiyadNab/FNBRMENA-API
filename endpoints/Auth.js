module.exports = {
    endpoints: 'auth',
    callback: async (admin, app, req, res) => {

        //setting up the db firestore
        const db = admin.firestore()
        if(req.query.authType == 'exchange' || req.query.authType == 'token'){
            const authTypeCredentialResponse = await db.collection("authTokens").doc(req.query.authType).get()

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
                        token: {
                            access_token: authTypeCredentialResponse.data().api.tokenData.access_token,
                            expires_in: authTypeCredentialResponse.data().api.tokenData.expires_in,
                            expires_at: authTypeCredentialResponse.data().api.tokenData.expires_at,
                            token_type: authTypeCredentialResponse.data().api.tokenData.token_type,
                            refresh_token: authTypeCredentialResponse.data().api.tokenData.refresh_token,
                            refresh_expires: authTypeCredentialResponse.data().api.tokenData.refresh_expires,
                            refresh_expires_at: authTypeCredentialResponse.data().api.tokenData.refresh_expires_at,
                            account_id: authTypeCredentialResponse.data().api.tokenData.account_id,
                            client_id: authTypeCredentialResponse.data().api.tokenData.client_id,
                            internal_client: authTypeCredentialResponse.data().api.tokenData.internal_client,
                            client_service: authTypeCredentialResponse.data().api.tokenData.client_service,
                            displayName: authTypeCredentialResponse.data().api.tokenData.displayName,
                            app: authTypeCredentialResponse.data().api.tokenData.app,
                            in_app_id: authTypeCredentialResponse.data().api.tokenData.in_app_id,
                            device_id: authTypeCredentialResponse.data().api.tokenData.device_id,
                        }
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
                        error: {
                            errorCode: authTypeCredentialResponse.data().api.errorData.errorCode,
                            errorMessage: authTypeCredentialResponse.data().api.errorData.errorMessage,
                            messageVars: authTypeCredentialResponse.data().api.errorData.messageVars,
                            numericErrorCode: authTypeCredentialResponse.data().api.errorData.numericErrorCode,
                            intent: authTypeCredentialResponse.data().api.errorData.intent,
                            error_description: authTypeCredentialResponse.data().api.errorData.error_description,
                            error: authTypeCredentialResponse.data().api.errorData.error,
                        }
                    }
                })
            }
        }else if(Object.keys(req.query).includes('authType') && req.query.authType.length !== 0){

            //request status
            res.status(503)

            //response data
            res.json({
                status: 503,
                error: `The query parameter of authType ${req.query.authType} is not valid`,
                validAuthTypes: [
                    'exchange',
                    'token'
                ]
            })

        }else if(Object.keys(req.query).includes('authType') && req.query.authType.length === 0){

            //request status
            res.status(503)

            //response data
            res.json({
                status: 503,
                error: `No authType has been provided`,
                pleaseProvideOneOfTheseTypes: [
                    'exchange',
                    'token'
                ]
            })

        }else{

            //request status
            res.status(503)

            //response data
            res.json({
                status: 503,
                error: "No supported query parameters has been set",
                supportedParamerters: [
                    'authType'
                ],
                validAuthTypes: [
                    'exchange',
                    'token'
                ]
            })
        }
    }
}