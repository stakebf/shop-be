import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { APIGatewayAuthorizerResult } from "aws-lambda";
import { POLICY_EFFECTS } from "src/shared/types/policy";

const _getExtractedAuthToken = (token: string) => {
  const [login, password] = Buffer.from(token.split(" ")[1], "base64").toString().split(":");

  return { login, password };
};

const _generatePolicy = ({ principalId, effect, resource }: {
  principalId: string;
  resource: string;
  effect: string;
}): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource
        }
      ]
    }
});

const _isValidBasicAuthToken = (type, authorizationToken) => {
  const base64regex = /^Basic ([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/gm;

  return type !== "TOKEN" && base64regex.test(authorizationToken);
};

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log(`"basicAuthorizer" was triggered with event: ${JSON.stringify(event)}`);
  
  try {
    const { authorizationToken, methodArn: resource, type } = event;
    
    if (_isValidBasicAuthToken(type, authorizationToken)) {
      throw new Error("Unauthorized");
    }
    
    const { login, password } = _getExtractedAuthToken(authorizationToken);

    return _generatePolicy({ 
      principalId: login,
      resource, 
      effect: process.env[login] !== password ? POLICY_EFFECTS.DENY : POLICY_EFFECTS.ALLOW
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const main = basicAuthorizer;
