import { JoinWaitListRequestBody, JOIN_WAIT_LIST, JoinWaitListResponse, WishlistRequestBody, WISHLIST, WishlistResponse } from './interface';
import { RemoteCallHandlerInterface } from '@selfage/service_descriptor/remote_call_handler_interface';

export abstract class JoinWaitListHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = JOIN_WAIT_LIST;
  public abstract handle(
    loggingPrefix: string,
    body: JoinWaitListRequestBody,
  ): Promise<JoinWaitListResponse>;
}

export abstract class WishlistHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = WISHLIST;
  public abstract handle(
    loggingPrefix: string,
    body: WishlistRequestBody,
  ): Promise<WishlistResponse>;
}
