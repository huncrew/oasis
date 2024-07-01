import { StackContext, Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
},
    routes: {
      "GET /": "services/test-service/src/index.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
