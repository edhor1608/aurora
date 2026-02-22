import { type Session, assertActiveSession } from "./auth";
import {
  type ChannelPermission,
  type PermissionInput,
  resolveChannelPermission,
} from "./permissions";

type MemberRole = "owner" | "member";

type Community = {
  id: string;
  name: string;
  members: Record<string, MemberRole>;
};

type Channel = {
  id: string;
  communityId: string;
  name: string;
  overrides: PermissionInput["overrides"];
};

type Message = {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  sortKey: number;
};

export type CoreState = {
  communities: Record<string, Community>;
  channels: Record<string, Channel>;
  messagesByChannel: Record<string, Message[]>;
};

export const createCoreState = (): CoreState => {
  return {
    communities: {},
    channels: {},
    messagesByChannel: {},
  };
};

export const createCommunity = (
  state: CoreState,
  input: { communityId: string; name: string; ownerId: string },
): void => {
  state.communities[input.communityId] = {
    id: input.communityId,
    name: input.name,
    members: {
      [input.ownerId]: "owner",
    },
  };
};

export const addMember = (
  state: CoreState,
  input: { communityId: string; userId: string; role: MemberRole },
): void => {
  const community = state.communities[input.communityId];

  if (!community) {
    throw new Error("COMMUNITY_NOT_FOUND");
  }

  community.members[input.userId] = input.role;
};

export const createChannel = (
  state: CoreState,
  input: {
    channelId: string;
    communityId: string;
    name: string;
    overrides: PermissionInput["overrides"];
  },
): void => {
  if (!state.communities[input.communityId]) {
    throw new Error("COMMUNITY_NOT_FOUND");
  }

  state.channels[input.channelId] = {
    id: input.channelId,
    communityId: input.communityId,
    name: input.name,
    overrides: input.overrides,
  };

  state.messagesByChannel[input.channelId] = [];
};

const getRoleBasePermission = (role: MemberRole): ChannelPermission => {
  if (role === "owner") {
    return { send_message: true };
  }

  return { send_message: true };
};

export const sendMessage = (
  state: CoreState,
  input: {
    session: Session;
    now: number;
    channelId: string;
    content: string;
  },
): Message => {
  assertActiveSession(input.session, input.now);

  const channel = state.channels[input.channelId];

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  const community = state.communities[channel.communityId];

  if (!community) {
    throw new Error("COMMUNITY_NOT_FOUND");
  }

  const role = community.members[input.session.userId];

  if (!role) {
    throw new Error("AUTH_FORBIDDEN");
  }

  const permissions = resolveChannelPermission({
    base: getRoleBasePermission(role),
    overrides: channel.overrides,
  });

  if (!permissions.send_message) {
    throw new Error("PERMISSION_DENIED");
  }

  const nextSortKey = state.messagesByChannel[input.channelId].length + 1;
  const message: Message = {
    id: `${input.channelId}:${nextSortKey}`,
    channelId: input.channelId,
    authorId: input.session.userId,
    content: input.content,
    sortKey: nextSortKey,
  };

  state.messagesByChannel[input.channelId].push(message);

  return message;
};

export const listMessages = (state: CoreState, input: { channelId: string }): Message[] => {
  return [...(state.messagesByChannel[input.channelId] ?? [])];
};
