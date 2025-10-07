import { ENV_VARS } from "../env_vars";
import { JoinWaitListHandlerInterface } from "../service_interface/handler";
import {
  JoinWaitListRequestBody,
  JoinWaitListResponse,
} from "../service_interface/interface";
import { DATASTORE_CLIENT } from "./datastore_client";
import { SENDGRID_CLIENT } from "./sendgrid_client";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";
import { MailService } from "@sendgrid/mail";

export class JoinWaitListHandler extends JoinWaitListHandlerInterface {
  public static create(): JoinWaitListHandler {
    return new JoinWaitListHandler(DATASTORE_CLIENT, SENDGRID_CLIENT);
  }

  public constructor(
    private datastore: Datastore,
    private sendgridClient: MailService,
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
      this.sendgridClient.send({
        to: body.email,
        from: {
          email: ENV_VARS.contactEmail,
          name: ENV_VARS.contactEmailName,
        },
        subject: `Thank you for joining the wait list!`,
        text: `Thank you for joining the wait list for ${ENV_VARS.platformName}! We will notify you when we launch.\n\n- The ${ENV_VARS.platformName} Team`,
      }),
      this.sendgridClient.send({
        to: ENV_VARS.adminEmails,
        from: {
          email: ENV_VARS.contactEmail,
          name: ENV_VARS.contactEmailName,
        },
        subject: `[${ENV_VARS.platformName}] New wait list entry`,
        text: `A new user has joined the wait list.\n\nEmail: ${body.email}\nRole: ${body.role}\n`,
      }),
    ]);
    return {};
  }
}
