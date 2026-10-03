import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ashutosh-trade.fionahd683.chatgpt.site"),
  title: { default: "Ashutosh Trade | Housekeeping & Facility Supplies in Nepal", template: "%s" },
  description: "Explore housekeeping supplies, facility products, cleaning machinery and related product categories from Ashutosh Trade in Kathmandu, Nepal.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context":"https://schema.org", "@type":"LocalBusiness", name:"Ashutosh Trade", address:{"@type":"PostalAddress",addressLocality:"Kathmandu",addressCountry:"NP"}, areaServed:"Nepal", description:"Supplier of housekeeping products, facility essentials, cleaning machinery and related consumables, equipment, accessories and spare parts." };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/></body></html>;
}
