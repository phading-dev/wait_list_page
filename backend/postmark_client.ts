import getStream = require("get-stream");
import postmark = require("postmark");
import { ENV_VARS } from "../env_vars";
import { STORAGE_CLIENT } from "./storage_client";
import { Ref } from "@selfage/ref";

export let POSTMARK_CLIENT = new Ref<postmark.ServerClient>();

export async function initPostmarkClient(): Promise<void> {
  let [token] = await Promise.all([
    getStream(
      STORAGE_CLIENT.bucket(ENV_VARS.gcsSecretBucketName)
        .file(ENV_VARS.postmarkApiTokenFile)
        .createReadStream(),
    ),
  ]);
  POSTMARK_CLIENT.val = new postmark.ServerClient(token);
}
