export const API_VERSION = "v1" as const;

export const SDK_CAPABILITIES = [
  "communities.read",
  "communities.write",
  "channels.read",
  "channels.write",
  "messages.read",
  "messages.write",
  "voice.presence",
] as const;

export type AuroraCapability = (typeof SDK_CAPABILITIES)[number];

export const supportsCapability = (capability: string): capability is AuroraCapability => {
  return SDK_CAPABILITIES.includes(capability as AuroraCapability);
};
