import { JoinWaitListRequestBody, JoinWaitListResponse, JOIN_WAIT_LIST, WishlistRequestBody, WishlistResponse, WISHLIST } from './interface';
import { ClientRequestInterface } from '@selfage/service_descriptor/client_request_interface';

export function newJoinWaitListRequest(
  body: JoinWaitListRequestBody,
): ClientRequestInterface<JoinWaitListResponse> {
  return {
    descriptor: JOIN_WAIT_LIST,
    body,
  };
}

export function newWishlistRequest(
  body: WishlistRequestBody,
): ClientRequestInterface<WishlistResponse> {
  return {
    descriptor: WISHLIST,
    body,
  };
}
