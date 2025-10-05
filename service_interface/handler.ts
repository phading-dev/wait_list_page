import { JoinWaitListRequestBody, JOIN_WAIT_LIST, JoinWaitListResponse } from './interface';
import { RemoteCallHandlerInterface } from '@selfage/service_descriptor/remote_call_handler_interface';

export abstract class JoinWaitListHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = JOIN_WAIT_LIST;
  public abstract handle(
    loggingPrefix: string,
    body: JoinWaitListRequestBody,
  ): Promise<JoinWaitListResponse>;
}
