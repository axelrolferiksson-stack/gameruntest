import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.axel.gamerun",
  appName: "GameRun",
  webDir: "dist",
  server: {
    url: "https://503d1e38-b793-44fb-8f07-66d3956b094c.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
};

export default config;
