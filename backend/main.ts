import expressStaticGzip = require("express-static-gzip");
import http = require("http");
import { ENV_VARS } from "../env_vars";
import { WAIT_LIST_SERVICE } from "../service_interface/interface";
import { JoinWaitListHandler } from "./join_wait_list_handler";
import { ServiceHandler } from "@selfage/service_handler/service_handler";
import { Express } from "express";

async function main(): Promise<void> {
  // TODO: Setup HTTPS server and add redirection. Add redirection for synonym domains.
  let service = ServiceHandler.create(
    http.createServer(),
    ENV_VARS.externalOrigin,
  ).addCorsAllowedPreflightHandler();
  service
    .addHandlerRegister(WAIT_LIST_SERVICE)
    .add(JoinWaitListHandler.create());

  let app = (service as any).app as Express;
  app.get("/*", (req, res, next) => {
    console.log(`Received GET request at ${req.originalUrl}.`);
    next();
  });
  app.use(
    "/",
    expressStaticGzip(process.argv[2], {
      serveStatic: {
        extensions: ["html"],
        fallthrough: false,
      },
    }),
  );
  await service.start(ENV_VARS.port);
}

main();
