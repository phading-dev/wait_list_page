import postmark = require("postmark");
import { WishlistHandlerInterface } from "../service_interface/handler";
import {
  WishlistRequestBody,
  WishlistResponse,
} from "../service_interface/interface";
import { DATASTORE_CLIENT } from "./datastore_client";
import { POSTMARK_CLIENT } from "./postmark_client";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";
import { Ref } from "@selfage/ref";
import { ENV_VARS } from "../env_vars";

export class WishListHandler extends WishlistHandlerInterface {
  public static create(): WishListHandler {
    return new WishListHandler(DATASTORE_CLIENT, POSTMARK_CLIENT);
  }

  private static MESSAGE_STREAM = "outbound";

  private constructor(
    private datastore: Datastore,
    private postmarkClient: Ref<postmark.ServerClient>,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: WishlistRequestBody,
  ): Promise<WishlistResponse> {
    body.email = body.email?.trim();
    if (!body.email || body.email.length > 300) {
      throw newBadRequestError(
        `"email" is required and must be at most 300 characters.`,
      );
    }
    if (!body.feature) {
      throw newBadRequestError(`"feature" is required.`);
    }
    let key = this.datastore.key(["WishlistEntry", body.email]);
    await this.datastore.save({
      key: key,
      data: {
        email: body.email,
        feature: body.feature,
        idea: body.idea,
        timestamp: Date.now(),
      },
      method: "upsert",
    });
    await Promise.all([
      this.postmarkClient.val.sendEmail({
        To: body.email,
        From: ENV_VARS.contactPersonEmail,
        MessageStream: WishListHandler.MESSAGE_STREAM,
        Subject: `Thank you for joining the ${ENV_VARS.platformName} wish list!`,
        TextBody: `Hey there,

Welcome to ${ENV_VARS.platformName}! Thank you for joining our wish list. We appreciate your interest and may occasionally reach out to you for further feedback as we develop new features.

If you’d like to see ${ENV_VARS.platformName} come to life sooner, feel free to share it with friends who’d love the idea too.

Best regards,
${ENV_VARS.contactPersonName} & the ${ENV_VARS.platformName} Team`,
      }),
      this.postmarkClient.val.sendEmail({
        To: ENV_VARS.adminEmails.join(", "),
        From: ENV_VARS.contactEmail,
        MessageStream: "outbound",
        Subject: `[${ENV_VARS.platformName}] New wish list entry`,
        TextBody: `A new user has joined the wish list.\n\nEmail: ${body.email}\nFeature: ${body.feature}\nIdea: ${body.idea || "N/A"}`,
      }),
    ]);
    return {};
  }
}
