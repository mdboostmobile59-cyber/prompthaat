// PromptHaat Official WhatsApp Community Configuration
export const DEFAULT_WHATSAPP_COMMUNITY_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ||
  "https://chat.whatsapp.com/your-community-invite-link";

export function getWhatsAppCommunityUrl(): string {
  return DEFAULT_WHATSAPP_COMMUNITY_URL;
}
