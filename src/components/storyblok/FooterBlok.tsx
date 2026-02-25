import { storyblokEditable } from "@storyblok/react/rsc";
import { Footer } from "@/components/Footer";
import type { FooterData } from "@/types";

export function FooterBlok({ blok }: { blok: any }) {
  const data: FooterData = {
    closingHeading: blok.closing_heading || "",
    closingText: blok.closing_text || "",
    logoUrl: blok.logo?.filename || "/WAN-Logo.png",
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Footer data={data} />
    </div>
  );
}
