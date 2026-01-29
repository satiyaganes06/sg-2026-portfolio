export const MINECRAFT_MODELS = ["creeper", "zombie", "steve", "enderman"] as const;
export type MinecraftKind = typeof MINECRAFT_MODELS[number];
