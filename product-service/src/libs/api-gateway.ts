export const formatJSONResponse = ({
  body,
  statusCode
}: {body: any, statusCode: number}) => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
  }
}
