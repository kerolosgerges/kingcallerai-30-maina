
/**
 * Centralized API key management.
 * Uses environment variables with fallbacks for development.
 */
export const apiKeys = {
  openai: import.meta.env.VITE_OPENAI_KEY || "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",
  elevenLabs: import.meta.env.VITE_ELEVENLABS_KEY || "sk_630c641e0ccf04d95c4723c3b04bba4e849b4a481c9c0abc",
  kingCaller: {
    baseUrl: import.meta.env.VITE_KINGCALLER_API_URL || "https://api.kingcaller.ai",
    apiKey: import.meta.env.VITE_KINGCALLER_API_KEY || "",
  }
};
