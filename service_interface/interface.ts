import { ServiceDescriptor, RemoteCallDescriptor } from '@selfage/service_descriptor';
import { PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';

export let WAIT_LIST_SERVICE: ServiceDescriptor = {
  name: "WaitListService",
  path: "/w",
}

export interface JoinWaitListRequestBody {
  email?: string,
  role?: string,
}

export let JOIN_WAIT_LIST_REQUEST_BODY: MessageDescriptor<JoinWaitListRequestBody> = {
  name: 'JoinWaitListRequestBody',
  fields: [{
    name: 'email',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'role',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface JoinWaitListResponse {
}

export let JOIN_WAIT_LIST_RESPONSE: MessageDescriptor<JoinWaitListResponse> = {
  name: 'JoinWaitListResponse',
  fields: [],
};

export interface WishlistRequestBody {
  email?: string,
  feature?: string,
  idea?: string,
}

export let WISHLIST_REQUEST_BODY: MessageDescriptor<WishlistRequestBody> = {
  name: 'WishlistRequestBody',
  fields: [{
    name: 'email',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'feature',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'idea',
    index: 3,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface WishlistResponse {
}

export let WISHLIST_RESPONSE: MessageDescriptor<WishlistResponse> = {
  name: 'WishlistResponse',
  fields: [],
};

export let JOIN_WAIT_LIST: RemoteCallDescriptor = {
  name: "JoinWaitList",
  service: WAIT_LIST_SERVICE,
  path: "/JoinWaitList",
  body: {
    messageType: JOIN_WAIT_LIST_REQUEST_BODY,
  },
  response: {
    messageType: JOIN_WAIT_LIST_RESPONSE,
  },
}

export let WISHLIST: RemoteCallDescriptor = {
  name: "Wishlist",
  service: WAIT_LIST_SERVICE,
  path: "/Wishlist",
  body: {
    messageType: WISHLIST_REQUEST_BODY,
  },
  response: {
    messageType: WISHLIST_RESPONSE,
  },
}
