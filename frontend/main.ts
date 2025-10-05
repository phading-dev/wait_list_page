import { ENV_VARS } from "../env_vars";
import { MainBody } from "./body";
import { FanBody } from "./fan_body";

async function main(): Promise<void> {
  document.head.title = ENV_VARS.platformName;
  if (ENV_VARS.flavor === "secount") {
    MainBody.create();
  } else if (ENV_VARS.flavor === "fandazy") {
    FanBody.create();
  }
}

main();
