import { SearchX } from "lucide-react";
import Link from "next/link";
export const metadata = { title: "Page Not Found | Ashutosh Trade", description: "The requested Ashutosh Trade page could not be found." };
export default function NotFound(){return <main className="not-found"><div><SearchX/><span className="eyebrow">404 — Page not found</span><h1>We couldn’t find that page.</h1><p>The address may have changed, or the page may no longer exist. You can return home or browse the product catalogue.</p><div className="hero-actions"><Link className="button primary" href="/">Return Home</Link><Link className="button secondary" href="/catalogue">Browse Catalogue</Link></div></div></main>}
