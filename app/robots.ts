import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots { return { rules:{userAgent:"*",allow:"/",disallow:["/api/"]}, sitemap:"https://ashutosh-trade.adept-gnat-6575.chatgpt.site/sitemap.xml" }; }
