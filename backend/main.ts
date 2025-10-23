import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { ENV_VARS } from "../env_vars";
import { WAIT_LIST_SERVICE } from "../service_interface/interface";
import { JoinWaitListHandler } from "./join_wait_list_handler";
import { initPostmarkClient } from "./postmark_client";
import { STORAGE_CLIENT } from "./storage_client";
import { WishListHandler } from "./wish_list_handler";
import { ServiceHandler } from "@selfage/service_handler/service_handler";
import { Express } from "express";

async function main(): Promise<void> {
  let [sslPrivateKey, sslCertificate] = await Promise.all([
    getStream(
      STORAGE_CLIENT.bucket(ENV_VARS.gcsSecretBucketName)
        .file(ENV_VARS.sslPrivateKeyFile)
        .createReadStream(),
    ),
    getStream(
      STORAGE_CLIENT.bucket(ENV_VARS.gcsSecretBucketName)
        .file(ENV_VARS.sslCertificateFile)
        .createReadStream(),
    ),
    initPostmarkClient(),
  ]);
  let service = ServiceHandler.create(
    https.createServer({
      key: sslPrivateKey,
      cert: sslCertificate,
    }),
    ENV_VARS.externalOrigin,
  ).addCorsAllowedPreflightHandler();
  service
    .addHandlerRegister(WAIT_LIST_SERVICE)
    .add(JoinWaitListHandler.create())
    .add(WishListHandler.create());

  // Web UI
  let app = (service as any).app as Express;
  app.get("/*", (req, res, next) => {
    console.log(`Received GET request at ${req.originalUrl}.`);
    if (req.hostname !== ENV_VARS.externalDomain) {
      res.redirect(`${ENV_VARS.externalOrigin}${req.path}`);
    } else {
      next();
    }
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
  service.start(ENV_VARS.httpsPort);

  // HTTP server that redirects to HTTPS
  let redirectApp = express();
  redirectApp.get("/*", (req, res) => {
    res.redirect(`${ENV_VARS.externalOrigin}${req.path}`);
  });
  let httpServer = http.createServer(redirectApp);
  httpServer.listen(ENV_VARS.httpPort, () => {
    console.log(`Server is listening on port ${ENV_VARS.httpPort}.`);
  });
}

main();
