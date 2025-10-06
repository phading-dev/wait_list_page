import { JoinWaitListHandlerInterface } from "../service_interface/handler";
import {
  JoinWaitListRequestBody,
  JoinWaitListResponse,
} from "../service_interface/interface";
import { DATASTORE_CLIENT } from "./datastore_client";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";

export class JoinWaitListHandler extends JoinWaitListHandlerInterface {
  public static create(): JoinWaitListHandler {
    return new JoinWaitListHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastore: Datastore) {
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
    return {};
  }
}
