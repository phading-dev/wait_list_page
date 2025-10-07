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
      ...(body.role === "creator"
        ? [
            this.sendgridClient.send({
              to: body.email,
              from: {
                email: ENV_VARS.creatorContactEmail,
                name: ENV_VARS.contactEmailName,
              },
              subject: `Thank you for joining the wait list!`,
              text: `We are building a new platform that aims to put more earnings in creators' hands compared to what you may currently be using. In order to accomplish that, ${ENV_VARS.platformName} needs your continuous feedback. Our goal is to build the features that matter to you as a creator and to help you grow your fanbase. Please write back to us and take advantage of this opportunity to guide ${ENV_VARS.platformName} towards a product/service that focuses on your success.\n\n- The ${ENV_VARS.platformName} Team`,
            }),
          ]
        : [
            this.sendgridClient.send({
              to: body.email,
              from: {
                email: ENV_VARS.fanContactEmail,
                name: ENV_VARS.contactEmailName,
              },
              subject: `Thank you for joining the wait list!`,
              text: `We know you have many other options to support your favorite content creators. ${ENV_VARS.platformName} strives to give you a far better experience, a more authentic relationship with your favorite content creators. In order to accomplish that, ${ENV_VARS.platformName} needs your continuous feedback. Our goal is to build the features that matter to you as a loyal fan. Please write back to us and take advantage of this opportunity to guide ${ENV_VARS.platformName} towards a product/service that focuses on your personal enjoyment.\n\n- The ${ENV_VARS.platformName} Team`,
            }),
          ]),
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
