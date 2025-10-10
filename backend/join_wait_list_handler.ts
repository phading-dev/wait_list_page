import postmark = require("postmark");
import { ENV_VARS } from "../env_vars";
import { JoinWaitListHandlerInterface } from "../service_interface/handler";
import {
  JoinWaitListRequestBody,
  JoinWaitListResponse,
} from "../service_interface/interface";
import { DATASTORE_CLIENT } from "./datastore_client";
import { POSTMARK_CLIENT } from "./postmark_client";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";
import { Ref } from "@selfage/ref";

export class JoinWaitListHandler extends JoinWaitListHandlerInterface {
  public static create(): JoinWaitListHandler {
    return new JoinWaitListHandler(DATASTORE_CLIENT, POSTMARK_CLIENT);
  }

  private static MESSAGE_STREAM = "outbound";

  public constructor(
    private datastore: Datastore,
    private postmarkClient: Ref<postmark.ServerClient>,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: JoinWaitListRequestBody,
  ): Promise<JoinWaitListResponse> {
    body.email = body.email?.trim();
    if (!body.email || body.email.length > 300) {
      throw newBadRequestError(
        `"email" is required and must be at most 300 characters.`,
      );
    }
    if (!body.role || (body.role !== "creator" && body.role !== "fan")) {
      throw newBadRequestError(
        `"role" is required and must be either "creator" or "fan".`,
      );
    }
    let key = this.datastore.key(["WaitListEntry", body.email]);
    await this.datastore.save({
      key: key,
      data: { email: body.email, role: body.role, timestamp: Date.now() },
      method: "upsert",
    });
    await Promise.all([
      ...(body.role === "creator"
        ? [
            this.postmarkClient.val.sendEmail({
              To: body.email,
              From: ENV_VARS.contactPersonEmail,
              MessageStream: JoinWaitListHandler.MESSAGE_STREAM,
              Subject: `Thank you for joining the ${ENV_VARS.platformName} waitlist!`,
              TextBody: `Hey there,
Welcome to ${ENV_VARS.platformName}! We’re building a platform that lets creators keep more of what they earn — and grow faster with tools that actually support your success.

We’d love your input as we shape ${ENV_VARS.platformName}’s next steps. Tell us what features or improvements would make the biggest difference for you.

Just reply to this email — your ideas will directly influence what we build next.

Thanks for joining early,
${ENV_VARS.contactPersonName} & the ${ENV_VARS.platformName} Team`,
            }),
          ]
        : [
            this.postmarkClient.val.sendEmail({
              To: body.email,
              From: ENV_VARS.contactPersonEmail,
              MessageStream: JoinWaitListHandler.MESSAGE_STREAM,
              Subject: `Thank you for joining the ${ENV_VARS.platformName} waitlist!`,
              TextBody: `Hey there,
Welcome to ${ENV_VARS.platformName}! We know you have plenty of ways to support creators, but we’re building something a little different — a platform that helps fans like you connect more authentically with the people you love watching.

To make that happen, we’d love your feedback. Tell us what kind of features or experiences would make ${ENV_VARS.platformName} more fun and rewarding for you.

Just reply to this email — your thoughts will directly shape how ${ENV_VARS.platformName} grows.

Thanks for being here,
${ENV_VARS.contactPersonName} & the ${ENV_VARS.platformName} Team`,
            }),
          ]),
      this.postmarkClient.val.sendEmail({
        To: ENV_VARS.adminEmails.join(", "),
        From: ENV_VARS.contactEmail,
        MessageStream: "outbound",
        Subject: `[${ENV_VARS.platformName}] New wait list entry`,
        TextBody: `A new user has joined the wait list.\n\nEmail: ${body.email}\nRole: ${body.role}\n`,
      }),
    ]);
    return {};
  }
}
