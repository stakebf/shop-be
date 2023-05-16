import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: { "Fn::ImportValue": "basicAuthorizerArn" },
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "token"
        }
      },
    },
  ],
};
