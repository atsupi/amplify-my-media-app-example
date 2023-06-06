/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    mediaapipath
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log("Lambda", process.env.mediaapipath);
    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify({
            message: "Hello from Lambda!",
            apipath: process.env.mediaapipath,
        })
    };
};
