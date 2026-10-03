import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ashutosh-trade.adept-gnat-6575.chatgpt.site"),
  title: { default: "Ashutosh Trade | Housekeeping & Facility Supplies in Kathmandu", template: "%s" },
  description: "Explore housekeeping supplies, facility products and cleaning machinery for organizations in Kathmandu, Nepal.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context":"https://schema.org", "@type":"LocalBusiness", name:"Ashutosh Trade", address:{"@type":"PostalAddress",addressLocality:"Kathmandu",addressCountry:"NP"}, areaServed:"Kathmandu, Nepal", description:"Supplier of housekeeping supplies, facility products, cleaning machinery and related items for institutional and commercial buyers." };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/></body></html>;
}
