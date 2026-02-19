export const tableNames = ["communities", "channels", "messages"] as const;

export type ConvexTable = (typeof tableNames)[number];
