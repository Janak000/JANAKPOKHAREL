import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Janak Pokharel — Global SEO & Ads Manager",
    short_name: "Janak Pokharel",
    description:
      "SEO, Meta Ads, Google Ads, and growth systems for businesses worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#06080f",
    theme_color: "#d54835",
    icons: [
      { src: "/image/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/image/logo.webp", sizes: "256x256", type: "image/webp", purpose: "any" },
    ],
  };
}
