import { storyblokEditable } from "@storyblok/react/rsc";
import { Footer } from "@/components/Footer";
import { pageData } from "@/lib/data";
import type { FooterData } from "@/types";

const defaults = pageData.footer;

export function FooterBlok({ blok }: { blok: any }) {
  const data: FooterData = {
    closingHeading: blok.closing_heading || defaults.closingHeading,
    closingText: blok.closing_text || defaults.closingText,
    logoUrl: blok.logo?.filename || defaults.logoUrl,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Footer data={data} />
    </div>
  );
}
