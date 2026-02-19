export type ChannelPermission = {
  send_message: boolean;
};

export type PermissionInput = {
  base: ChannelPermission;
  overrides: Array<Partial<ChannelPermission>>;
};

export const resolveChannelPermission = (input: PermissionInput): ChannelPermission => {
  const resolved: ChannelPermission = { ...input.base };

  for (const override of input.overrides) {
    if (override.send_message !== undefined) {
      resolved.send_message = override.send_message;
    }
  }

  return resolved;
};
