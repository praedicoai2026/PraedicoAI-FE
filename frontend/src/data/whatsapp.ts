const configuredWhatsAppNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
const configured = /^[1-9]\d{7,14}$/.test(configuredWhatsAppNumber);

export const whatsapp = {
  configured,
  url: configured
    ? `https://wa.me/${configuredWhatsAppNumber}?text=${encodeURIComponent("Hello PraedicoAI, I would like to discuss AI solutions or learning.")}`
    : "",
};
