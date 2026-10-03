import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ashutosh-trade.fionahd683.chatgpt.site"),
  title: { default: "AI-Powered Digital Marketing | Ashutosh Trade", template: "%s" },
  description: "Turn scattered marketing into a clear growth plan with AI-powered insights and practical human strategy.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context":"https://schema.org", "@type":"ProfessionalService", name:"Ashutosh Trade", address:{"@type":"PostalAddress",addressLocality:"Kathmandu",addressCountry:"NP"}, areaServed:"Kathmandu, Nepal", description:"AI-powered digital marketing strategy and customized marketing plans for growing businesses." };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/></body></html>;
}
