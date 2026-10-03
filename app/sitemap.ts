import type { MetadataRoute } from "next";
import { categories } from "@/lib/site-data";
export default function sitemap():MetadataRoute.Sitemap { const base="https://ashutosh-trade.fionahd683.chatgpt.site"; return ["/","/about-us","/products","/catalogue","/contact",...categories.map(c=>`/products/${c.slug}`)].map(url=>({url:`${base}${url}`,lastModified:new Date(),changeFrequency:"monthly",priority:url==="/"?1:.8})); }
