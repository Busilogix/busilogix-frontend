export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://busilogix.com";

export const sharedOpenGraph = {
  type: "website",
  locale: "en_US",
  siteName: "Busilogix",
  images: [
    {
      url: "/og-banner.png",
      width: 1200,
      height: 630,
      alt: "Busilogix – Intelligent Commerce Operations Platform",
    },
  ],
};

export const sharedTwitter = {
  card: "summary_large_image",
  images: ["/og-banner.png"],
};
