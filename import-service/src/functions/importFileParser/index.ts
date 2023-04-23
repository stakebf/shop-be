import { handlerPath } from "@libs/handler-resolver";
import { userConfig } from "src/configuration";

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: userConfig.BUCKET_NAME,
        event: "s3:ObjectCreated:*",
        rules: [
          { 
            prefix: "uploaded/"
          }
        ],
        existing: true
      },
    },
  ],
};
