import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteClient } from "@/components/site-client";
import { categoryBySlug, mainRoutes, routeMeta } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug?: string[] }> };

function resolvePath(slug?:string[]) { return slug?.length ? `/${slug.join("/")}` : "/"; }
function isValid(pathname:string) { return mainRoutes.includes(pathname) || (pathname.startsWith("/products/") && !!categoryBySlug[pathname.replace("/products/","")]); }

export async function generateMetadata({params}:PageProps):Promise<Metadata> {
  const {slug}=await params; const pathname=resolvePath(slug); const meta=routeMeta(pathname);
  return { title:meta.title, description:meta.description, alternates:{canonical:pathname}, openGraph:{title:meta.title,description:meta.description,type:"website",locale:"en_NP",siteName:"Ashutosh Trade"} };
}

export default async function Page({params}:PageProps) {
  const {slug}=await params; const pathname=resolvePath(slug); if(!isValid(pathname))notFound();
  return <SiteClient pathname={pathname}/>;
}
