"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, BedDouble, BrushCleaning, Building2, Check, ChevronDown, ClipboardList, Clock,
  Cog, FlaskConical, Hand, HeartPulse, Hotel, Menu, MessageSquareText, PanelTop, RotateCcw,
  School, Search, ShieldCheck, Shirt, Sparkles, ScrollText, Send, SlidersHorizontal,
  Wind, BriefcaseBusiness, PackageSearch, MapPin, Box, CheckCircle2, AlertCircle, Mail, Phone
} from "lucide-react";
import { categories, categoryBySlug, consultationMessage, productById, products, type Product } from "@/lib/site-data";
import { business } from "@/lib/business-config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const iconMap = { FlaskConical, BrushCleaning, Cog, ScrollText, PanelTop, Hand, Wind, BedDouble, Shirt, ShieldCheck };
const Icon = ({ name, size=22 }:{name:string,size?:number}) => { const Component = iconMap[name as keyof typeof iconMap] || Box; return <Component size={size}/>; };
const mainLinks = [["/","Home"],["/about-us","About Us"],["/products","Products"],["/contact","Contact"]];
const productNavigationCategories = categories.filter(category=>category.slug!=="guest-room-amenities");
const navigationCategoryName = (slug:string,name:string) => slug==="linens-guest-apparel"?"Room Amenities & Guest Apparel":name;
const homepageCategoryHeadings:Record<string,[string,string]> = {
  "cleaning-laundry-chemicals":["Cleaning & Laundry Chemicals",""],
  "cleaning-tools-equipment":["Cleaning Tools & Equipment",""],
  "machinery-spare-parts":["Machinery & Spare Parts",""],
  "papers-disposables":["Papers & Disposables",""],
  "dispensing-systems":["Dispensing Systems",""],
  "hand-hygiene-soaps":["Hand Hygiene & Soaps",""],
  "air-care-fresheners":["Air Care & Fresheners",""],
  "linens-guest-apparel":["Room Amenities & Guest Apparel",""],
  "pest-control-solutions":["Pest Control Solutions",""]
};
const heroImages = Array.from({length:15},(_,index)=>`/assets/hs${String(index+1).padStart(2,"0")}.jpg`);
const heroHeadlines = [
  "The right Supplies for a Cleaner, Safer Facility",
  "Supplies that fit the way your Facility works",
  "Everything your Facility needs to stay ready",
  "Branded or Generic—matched to your needs",
  "A practical Supply Partner for you"
];
const heroFocalPoints = ["58% 50%","50% 52%","52% 52%","50% 50%","50% 58%","62% 52%","57% 55%","58% 50%","58% 50%","54% 52%","62% 54%","50% 58%","58% 50%","58% 54%","62% 48%"];
const homepageCategoryDescriptions:Record<string,string> = {
  "cleaning-laundry-chemicals":"Explore illustrative cleaning and laundry chemical types for routine facility, housekeeping and linen-care requirements.",
  "machinery-spare-parts":"Review illustrative machinery types and request information about compatible accessories or spare parts for your requirements.",
  "dispensing-systems":"Browse illustrative dispensing formats and discuss options suited to your washrooms, kitchens and shared spaces.",
  "air-care-fresheners":"Explore illustrative air-care and odor-control product types for a range of facility environments.",
  "pest-control-solutions":"Review illustrative pest-management supply categories. Request product-specific information and instructions before use.",
  "cleaning-tools-equipment":"Browse illustrative tools and equipment that support cleaning teams across different spaces and routines.",
  "papers-disposables":"Explore illustrative paper and disposable product types for washrooms, housekeeping and general facility use.",
  "hand-hygiene-soaps":"Review illustrative handwash and soap categories for institutional and commercial washroom requirements.",
  "linens-guest-apparel":"Explore illustrative linen and guest apparel types and discuss material, size and presentation requirements."
};
const homepageCategoryExamples:Record<string,string> = {
  "cleaning-laundry-chemicals":"Floor Cleaners, Glass Cleaners, Disinfectants, Degreasers, Toilet Cleaners, Laundry Detergents, Fabric Conditioners, Stain Removers etc.",
  "machinery-spare-parts":"Vacuum Cleaners, Scrubber Dryers, Polishers, Pressure Washers, Lawn Mower, Pads, Hoses, Motors, Brushes, Replacement Parts etc.",
  "dispensing-systems":"Soap Dispensers, Sanitizer Dispensers, Tissue Dispensers, Paper-Towel Dispensers, Chemical-Dosing Systems.",
  "air-care-fresheners":"Aerosol Fresheners, Refills, Automatic Dispensers, Odor-Control Products, Fragrance Systems.",
  "pest-control-solutions":"Insect-Control Products, Traps, Repellents, Bait Stations, Application Equipment, Related Supplies.",
  "cleaning-tools-equipment":"Mops, Buckets, Wringers, Brushes, Squeegees, Dusters, Cleaning Carts, Warning Signs, Microfiber Products.",
  "papers-disposables":"Tissue Rolls, Paper Towels, Napkins, Garbage Bags, Disposable Gloves, Masks, Cups, Related Consumables.",
  "hand-hygiene-soaps":"Liquid Hand Wash, Foam Soap, Hand Sanitizer, Antibacterial Solutions, Industrial Hand Cleaners.",
  "linens-guest-apparel":"Toiletries, Dental Kits, Shaving Kits, Slippers, Room-Care Items, Hospitality Consumables, Housekeeping Apparel."
};
const formSubmitEndpoint = "/api/send-enquiry";
const isCurrent = (pathname:string, href:string) => href === "/" ? pathname === "/" : href === "/about-us" ? pathname === "/about-us" || pathname === "/about" : pathname === href || (href === "/products" && pathname.startsWith("/products/"));

async function sendFormSubmission(payload:Record<string,unknown>) {
  const response=await fetch(formSubmitEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(payload)});
  const data=await response.json().catch(()=>({})) as {success?:boolean;message?:string};
  if(!response.ok||data.success===false)throw new Error(data.message||"Your request could not be sent. Please try again.");
}

declare global { interface Document { modelContext?: { registerTool:(tool:unknown, options?:{signal?:AbortSignal})=>void|Promise<void> } } }

export function SiteClient({ pathname }:{pathname:string}) {
  const [consultOpen,setConsultOpen] = useState(false);
  const openConsult = () => setConsultOpen(true);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name:"start_digital_marketing_consultation_request",
      title:"Start a consultation request",
      description:"Open the request form for a free customized digital marketing plan. This does not confirm a booking.",
      inputSchema:{type:"object",properties:{},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:(input:unknown) => { if (!input || typeof input !== "object" || Object.keys(input as Record<string,unknown>).length) throw new Error("This tool does not accept input fields."); setConsultOpen(true); return {status:"form_opened",confirmation_required:true}; }
    },{signal:lifecycle.signal})).catch(()=>{});
    return () => lifecycle.abort();
  },[]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"));
    sections.forEach(section => section.classList.add("reveal-ready"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    }), { rootMargin:"0px 0px -8% 0px", threshold:0.06 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  },[pathname]);

  useEffect(() => {
    let frame = 0;
    let currentPosition = 0;
    let targetPosition = 0;
    const readTarget = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      targetPosition = progress * 25;
    };
    const animateBackground = () => {
      currentPosition += (targetPosition - currentPosition) * 0.12;
      if (Math.abs(targetPosition - currentPosition) < 0.01) currentPosition = targetPosition;
      document.documentElement.style.setProperty("--background-position-y", `${currentPosition}%`);
      frame = currentPosition === targetPosition ? 0 : window.requestAnimationFrame(animateBackground);
    };
    const requestUpdate = () => {
      readTarget();
      if (!frame) frame = window.requestAnimationFrame(animateBackground);
    };
    readTarget();
    currentPosition = targetPosition;
    document.documentElement.style.setProperty("--background-position-y", `${currentPosition}%`);
    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--background-position-y");
    };
  },[pathname]);

  return <>
    <div className="page-background" aria-hidden="true"/>
    <Header pathname={pathname} openConsult={openConsult}/>
    <main id="main-content">
      {pathname === "/" && <Home openConsult={openConsult}/>} 
      {(pathname === "/about-us" || pathname === "/about") && <About openConsult={openConsult}/>}
      {pathname === "/products" && <ProductsOverview openConsult={openConsult}/>}
      {pathname === "/contact" && <Contact openConsult={openConsult}/>} 
      {pathname === "/privacy-policy" && <LegalPage kind="privacy"/>}
      {pathname === "/terms" && <LegalPage kind="terms"/>}
      {pathname.startsWith("/products/") && <CategoryPage slug={pathname.replace("/products/","")} openConsult={openConsult}/>}
    </main>
    <Footer/>
    <ConsultationDialog open={consultOpen} setOpen={setConsultOpen}/>
  </>;
}

function Header({pathname,openConsult}:{pathname:string,openConsult:()=>void}) {
  const [productsOpen,setProductsOpen]=useState(false);
  const productsMenu=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const close=(event:MouseEvent)=>{if(productsMenu.current&&!productsMenu.current.contains(event.target as Node))setProductsOpen(false)};
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setProductsOpen(false)};
    document.addEventListener("mousedown",close); document.addEventListener("keydown",escape);
    return()=>{document.removeEventListener("mousedown",close);document.removeEventListener("keydown",escape)};
  },[]);
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <Link className="brand logo-brand" href="/" aria-label="Ashutosh Trade home"><Image src="/assets/ashutosh-trade-logo.png" width={652} height={179} priority alt="Ashutosh Trade"/></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/" aria-current={pathname==="/"?"page":undefined}>HOME</Link>
        <Link href="/about-us" aria-current={isCurrent(pathname,"/about-us")?"page":undefined}>ABOUT US</Link>
        <div className="nav-products" ref={productsMenu}>
          <div className="nav-combo"><Link href="/products" aria-current={isCurrent(pathname,"/products")?"page":undefined}>PRODUCTS</Link><button type="button" aria-label="Show product categories" aria-expanded={productsOpen} aria-controls="product-mega-menu" onClick={()=>setProductsOpen(v=>!v)}><ChevronDown size={17}/></button></div>
          {productsOpen&&<div className="mega-menu" id="product-mega-menu"><div><p className="menu-kicker">Product categories</p><h2>Explore the full range</h2><p>Browse illustrative product types, then request verified options for your requirements.</p></div><div className="mega-links">{productNavigationCategories.map(c=><Link key={c.slug} href={`/products/${c.slug}`} aria-current={pathname===`/products/${c.slug}`?"page":undefined} onClick={()=>setProductsOpen(false)}><span className="category-mini"><Icon name={c.icon} size={17}/></span>{navigationCategoryName(c.slug,c.shortName)}</Link>)}</div></div>}
        </div>
        <Link href="/contact" aria-current={pathname==="/contact"?"page":undefined}>CONTACT</Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild><button className="menu-button" aria-label="Open navigation"><Menu/></button></SheetTrigger>
        <SheetContent className="mobile-sheet"><SheetHeader><SheetTitle>Ashutosh Trade</SheetTitle><SheetDescription>Housekeeping, facility and cleaning-supply information for organizations in Nepal.</SheetDescription></SheetHeader>
          <nav className="mobile-nav" aria-label="Mobile navigation"><SheetClose asChild><Link href="/" aria-current={pathname==="/"?"page":undefined}>HOME</Link></SheetClose><SheetClose asChild><Link href="/about-us" aria-current={isCurrent(pathname,"/about-us")?"page":undefined}>ABOUT US</Link></SheetClose><details open={pathname.startsWith("/products")}><summary>PRODUCTS <ChevronDown size={17}/></summary><div>{productNavigationCategories.map(c=><SheetClose asChild key={c.slug}><Link href={`/products/${c.slug}`} aria-current={pathname===`/products/${c.slug}`?"page":undefined}>{navigationCategoryName(c.slug,c.shortName)}</Link></SheetClose>)}</div></details><SheetClose asChild><Link href="/contact" aria-current={pathname==="/contact"?"page":undefined}>CONTACT</Link></SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  </>;
}

function Home({openConsult}:{openConsult:()=>void}) {
  const sectors = [
    [HeartPulse,"Hospitals &","Healthcare","Hygiene, cleaning and disposable supplies for demanding care environments."],
    [Hotel,"Hotels &","Hospitality","Room amenities, linens, cleaning systems and guest-facing essentials."],
    [School,"Schools &","Colleges","Practical products for classrooms, washrooms and shared facilities."],
    [Building2,"Commercial","Facilities","Equipment and consumables for buildings, complexes and managed sites."],
    [BriefcaseBusiness,"Corporate","Offices","Reliable everyday supplies that keep workplaces clean and presentable."],
  ] as const;
  return <>
    <section className="hero hero-slideshow"><HeroSlideshow openConsult={openConsult}/></section>
    <section className="section section-tint"><div className="shell"><SectionHead eyebrow="" title={<><span className="title-line">Supplies that fit</span><span className="title-line">the way your facility works</span></>} copy="Different spaces have different standards, routines and purchasing pressures. We start with the facility, usage and budget—not a one-size-fits-all list."/><div className="industry-grid">{sectors.map(([I,titleLineOne,titleLineTwo,copy])=><article className="industry-card" key={`${titleLineOne} ${titleLineTwo}`}><I/><h3><span>{titleLineOne}</span><span>{titleLineTwo}</span></h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section shell product-range-section"><SectionHead eyebrow="" title={<><span className="title-line">Everything your facility</span><span className="title-line">needs to stay ready</span></>} copy="Browse nine practical categories, from daily housekeeping essentials to specialist machinery and replacement parts."/><CategoryGrid homepage/></section>
    <section className="section shell split-feature brand-match-section"><div><h2>Branded or generic—matched to your needs</h2><p>Not every task needs the same product or price point. Share your facility type, usage volume and budget, and we’ll help you compare appropriate branded products with cost-effective generic alternatives.</p><Link className="text-link" href="/about-us">How we work <ArrowUpRight size={16}/></Link></div><div className="feature-list">{[[ShieldCheck,"Fit for purpose","Recommendations based on the task, surface, setting and usage."],[PackageSearch,"Options for your budget","Compare established branded choices with practical alternatives."],[Cog,"Machinery support","Discuss equipment, compatible accessories and replacement-part needs."],[ClipboardList,"Simpler procurement","Bring related categories together in one clear enquiry."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></section>
    <section className="section process-section"><div className="shell"><SectionHead eyebrow="" title={<><span className="title-line">From requirement</span><span className="title-line">to dependable supply</span></>}/><ol className="process-list"><li><span>01</span><h3>Tell us what your facility needs</h3><p>Share the space, task, current challenge and approximate usage or quantity.</p></li><li><span>02</span><h3>Receive tailored recommendations</h3><p>Compare suitable product types, specifications and branded or generic options.</p></li><li><span>03</span><h3>Get dependable supply and support</h3><p>Confirm availability, packaging and quotation details directly with the team.</p></li></ol></div></section>
    <section className="section shell guidance-section"><SectionHead eyebrow="" title={<><span className="title-line">Practical guidance</span><span className="title-line">for busy procurement teams</span></>}/><div className="feature-list">{[[Search,"Find the right fit faster","Narrow a broad market into options relevant to your site and routine."],[SlidersHorizontal,"Balance quality and budget","Choose the level of specification that makes sense for each requirement."],[RotateCcw,"Plan repeat supply","Discuss consumables and replenishment needs alongside one-off equipment."],[MessageSquareText,"Talk to a real person","Ask questions about intended use, compatibility, sizes and alternatives."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></section>
    <section className="section section-tint"><div className="shell"><SectionHead eyebrow="" title="Testimonials coming soon" copy="Genuine customer testimonials have not yet been supplied. This section is reserved for verified feedback from institutional buyers."/><div className="testimonial-placeholder"><MessageSquareText/><p>Have you worked with Ashutosh Trade? Verified customer feedback can be added here once approved.</p></div></div></section>
    <section className="section shell action-strip final-action"><div><h2>Ready for clearer product options?</h2><p>Explore the product categories, request a quotation or book your free consultation call.</p></div><div><Link className="button hero-enquire" href="/products">EXPLORE PRODUCTS</Link></div></section>
  </>;
}

function HeroSlideshow({openConsult}:{openConsult:()=>void}) {
  const [active,setActive]=useState(0);
  useEffect(()=>{
    const timer=window.setInterval(()=>setActive(current=>(current+1)%heroImages.length),5000);
    return()=>window.clearInterval(timer);
  },[]);
  const headlineIndex=active%heroHeadlines.length;
  const previousHeadlineIndex=(headlineIndex+heroHeadlines.length-1)%heroHeadlines.length;
  return <div className="hero-showcase" aria-roledescription="carousel" aria-label="Ashutosh Trade facility supply highlights">
    <div className="hero-slides" aria-hidden="true">{heroImages.map((src,index)=><div className={`hero-slide ${index===active?"active":""}`} key={src}><Image src={src} fill priority={index===0} sizes="100vw" alt="" style={{objectPosition:heroFocalPoints[index]}}/></div>)}</div>
    <div className="hero-shade"/>
    <div className="hero-overlay shell"><h1 className="hero-rotator" aria-live="polite">{heroHeadlines.map((headline,index)=><span className={`hero-rotator-single ${index===headlineIndex?"is-visible":index===previousHeadlineIndex?"is-hidden":""}`} aria-hidden={index!==headlineIndex} key={headline}>{headline}</span>)}</h1><p>Ashutosh Trade helps organizations source practical housekeeping products, hygiene essentials, cleaning machinery, spare parts and everyday consumables.</p><Link className="button hero-enquire" href="/products">EXPLORE PRODUCTS</Link></div>
  </div>;
}

function About({openConsult}:{openConsult:()=>void}) { return <>
  <section className="page-hero about-page-hero">
    <div className="shell page-hero-inner">
      <h1>A practical supply partner for You</h1>
      <div className="about-hero-copy">
        <p>At Ashutosh Trade, we supply janitorial, cleaning, and hygiene products, along with cleaning machinery, that help facilities stay clean, safe, and ready for everyday use. We work with facilities management teams to understand their requirements and source supplies and equipment that suit their cleaning routines, operational needs, and budget. Whether you need branded products or dependable generic alternatives, our approach is straightforward: provide practical choices and timely delivery, making purchasing simpler and keeping your facility well supplied.</p>
        <p>We believe effective cleaning should support both people and the environment. By exploring useful innovations and more sustainable product choices, we help customers make informed decisions that support their hygiene goals and responsible use of resources. As your supply partner, our purpose is simple: to help you create cleaner, safer environments for everyone who uses your facility.</p>
      </div>
      <div className="hero-actions"><Link className="button about-hero-action" href="/products">EXPLORE PRODUCTS</Link></div>
    </div>
  </section>
  <section className="section shell about-purpose-section"><div><span className="eyebrow">Our purpose</span><h2>Help buyers choose well—without wasting time or budget</h2><p>Facility purchasing becomes difficult when specifications are unclear, alternatives are hard to compare or routine consumables come from too many sources. Ashutosh Trade helps buyers turn those scattered needs into a practical shortlist.</p><p>We listen to the facility type, intended application, expected usage and budget before discussing options. That means the recommendation starts with the customer’s real operating need rather than a generic sales list.</p></div></section>
  <section className="section section-tint"><div className="shell"><SectionHead eyebrow="Our approach" title="Useful recommendations, clear alternatives, long-term support"/><div className="feature-list">{[[Search,"Understand the requirement","Start with the space, task, standards, usage and current problem."],[SlidersHorizontal,"Match the right level","Compare recognized branded products with cost-effective generic alternatives."],[ClipboardList,"Confirm the details","Verify specifications, packaging, compatibility and availability before supply."],[RotateCcw,"Support ongoing needs","Build a relationship that makes repeat purchasing and replenishment simpler."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></div></section>
  <section className="section shell two-column"><div><span className="eyebrow">Industries served</span><h2>Different facilities. One practical way to buy.</h2></div><div><p>Product enquiries are welcome from hospitals and healthcare facilities, schools and colleges, hotels and resorts, restaurants, corporate offices, commercial buildings, shopping complexes and facility-management companies.</p><p>Our mission is simple: help organizations keep facilities clean, safe and presentable through practical advice, suitable products and dependable supply relationships.</p></div></section>
  </>; }

function ProductsOverview({openConsult}:{openConsult:()=>void}) { return <>
  <section className="section shell product-range-section products-page-grid" aria-label="Product categories"><CategoryGrid homepage/></section>
  <section className="section requirement-band products-requirement"><div className="shell two-column"><div><span className="eyebrow">Matched to your requirement</span><h2>Packaging, specifications, brands and alternatives can vary.</h2></div><div><p>Tell us what the product will be used for, expected usage volume and whether you want branded, generic or both kinds of options. We’ll discuss relevant choices and verify availability before quoting.</p><button className="button hero-enquire products-enquire" type="button" onClick={openConsult}>ENQUIRE NOW</button></div></div></section>
</>; }

function CategoryPage({slug,openConsult}:{slug:string,openConsult:()=>void}) {
  const category=categoryBySlug[slug]; const [type,setType]=useState("all"); if(!category)return null;
  const items=products.filter(p=>p.category===slug && (type==="all"||p.type===type));
  return <><section className="page-hero"><div className="shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span aria-current="page">{category.shortName}</span></nav><div className="page-hero-grid"><div><span className="eyebrow">Product category</span><h1>{category.name}</h1><p>{category.intro}</p><div className="hero-actions"><Link className="button primary" href={`/contact?type=quote&category=${category.slug}`}>Ask About This Category</Link></div></div><span className="large-icon"><Icon name={category.icon} size={50}/></span></div></div></section>
    <section className="section shell category-layout"><aside className="use-panel"><h2>Typical applications</h2><ul>{category.uses.map(u=><li key={u}><Check size={17}/>{u}</li>)}</ul><h3>Common product examples</h3><p>{category.examples.join(", ")}.</p><h3>Suitable for</h3><p>Hotels, hospitals, schools, offices, restaurants, commercial buildings and facility-management teams, depending on the product.</p><h3>Buying considerations</h3><p>Consider the task, surface or equipment compatibility, usage volume, packaging size, storage, staff routines and budget.</p><p className="sample-note">Branded and generic options can be discussed. Examples do not confirm inventory, specifications or performance.</p></aside><div><div className="category-products-heading"><div><span className="eyebrow">Illustrative products</span><h2>Product types in this category</h2></div><div className="filter-field"><label>Option type</label><Select value={type} onValueChange={v=>setType(v??"all")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All options</SelectItem><SelectItem value="Branded option">Branded option</SelectItem><SelectItem value="Generic option">Generic option</SelectItem></SelectContent></Select></div></div><ProductGrid items={items}/></div></section>
    <section className="section section-tint"><div className="shell"><SectionHead eyebrow="Related categories" title="Continue exploring"/><div className="related-links">{category.related.map(r=>{const c=categoryBySlug[r];return <Link key={r} href={`/products/${r}`}><span><Icon name={c.icon}/></span><strong>{c.shortName}</strong><ArrowUpRight/></Link>})}</div></div></section>
    <section className="section shell action-strip"><div><h2>Have a product requirement?</h2><p>Share the use case and ask for relevant branded or generic options.</p></div><div><Link className="button primary" href="https://www.ashutoshtrade.com.np/contact?type=quote#enquiry-form">Request a Quote</Link><Link className="button secondary" href="/contact">Contact Us</Link></div></section>
  </>;
}

function Contact({openConsult}:{openConsult:()=>void}) {
  const params=typeof window!=="undefined"?new URLSearchParams(window.location.search):null;
  const enquiryType=params?.get("type")==="quote"?"Product quotation":"General enquiry";
  const initialCategory=params?.get("category")&&categoryBySlug[params.get("category")!]?categoryBySlug[params.get("category")!].slug:"none";
  const initialProduct=params?.get("product")&&productById[params.get("product")!]?params.get("product")!:"none";
  const [fields,setFields]=useState({enquiryType,category:initialCategory,product:initialProduct});
  return <><section className="section shell contact-layout"><div><ul className="contact-detail-list"><li><MapPin/><div><strong>Location</strong><span>{business.location}</span></div></li><li><Phone/><div><strong>Phone</strong><span>{business.phone||"A public phone number has not yet been supplied."}</span></div></li><li><Mail/><div><strong>Email</strong><span>{business.email||"A public email address has not yet been supplied."}</span></div></li><li><Clock/><div><strong>Business hours</strong><span>{business.businessHours||"Business hours have not yet been supplied."}</span></div></li></ul><div className="contact-social-icons" aria-label="Social media channels">{[["WhatsApp","whatsapp.png","https://wa.me/9779715556165"],["Facebook","facebook.png","https://facebook.com/ashutosh.trade"],["Instagram","instagram.png","https://instagram.com/ashutosh.trade"],["TikTok","tiktok.png","https://tiktok.com/@ashutosh.trade"]].map(([label,file,url])=><a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} key={label}><Image src={`/assets/${file}`} width={36} height={36} alt=""/></a>)}</div></div></section>
    <section className="section section-tint" id="enquiry-form"><div className="shell form-shell"><InquiryForm fields={fields} setFields={setFields}/></div></section>
    <section className="section shell faq-section"><SectionHead eyebrow="Frequently asked questions" title="Useful details before you enquire"/><Accordion type="single" collapsible>{[
      ["Can you help me choose between branded and generic products?","Yes. Share the intended use, facility type, usage volume and budget. Ashutosh Trade can discuss both recognized branded products and cost-effective generic alternatives where available."],
      ["Are the products shown on the website confirmed in stock?","No. The website shows realistic product types, not a live inventory. Availability, brands, packaging, specifications and prices are confirmed during enquiry."],
      ["Can I request machinery spare parts?","Yes. Include the machine type, model or any part reference you have. Compatibility must be confirmed before supply."],
      ["Do you supply institutional buyers?","The site is designed for hospitals, schools, hotels, offices, restaurants, commercial facilities and facility-management companies. Share your requirement for a tailored response."],
      ["What is the free consultation call?","It is a separate digital marketing consultation. We’ll analyze your business and create a customized plan you can start implementing immediately."],
    ].map(([q,a],i)=><AccordionItem value={`contact-faq-${i}`} key={q}><AccordionTrigger className="faq-trigger">{q}</AccordionTrigger><AccordionContent><p>{a}</p></AccordionContent></AccordionItem>)}</Accordion></section>
  </>;
}

function InquiryForm({fields,setFields}:{fields:{enquiryType:string,category:string,product:string},setFields:(v:{enquiryType:string,category:string,product:string})=>void}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [error,setError]=useState("");
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(status==="loading"||status==="success")return;setStatus("loading");setError("");const form=new FormData(event.currentTarget);const payload=Object.fromEntries(form.entries());try{await sendFormSubmission({...payload,...fields,"Form type":"Product enquiry","_subject":"New Ashutosh Trade website enquiry","_template":"table","_replyto":String(payload.email||""),"_url":window.location.href,"_honey":String(payload.website||"")});setStatus("success")}catch(e){setStatus("error");setError(e instanceof Error?e.message:"Your enquiry could not be sent.")}};
  return <form className="form-card" onSubmit={submit} aria-describedby="form-status"><div className="form-heading"><span className="eyebrow">Enquiry form</span><h2>How can we help?</h2><p>Required fields are marked with an asterisk.</p></div><div className="form-grid"><Field label="Full name *" name="fullName" required/><Field label="Organization *" name="organization" required/><Field label="Email *" name="email" type="email" required/><Field label="Phone" name="phone" type="tel"/><SelectField label="Enquiry type *" value={fields.enquiryType} onChange={v=>setFields({...fields,enquiryType:v})} options={["General enquiry","Product quotation","Product information"]}/><SelectField label="Product category" value={fields.category} onChange={v=>setFields({...fields,category:v})} options={["none",...categories.map(c=>c.slug)]} labels={{none:"Not selected",...Object.fromEntries(categories.map(c=>[c.slug,c.shortName]))}}/><SelectField label="Selected product" value={fields.product} onChange={v=>setFields({...fields,product:v})} options={["none",...products.map(p=>p.id)]} labels={{none:"Not selected",...Object.fromEntries(products.map(p=>[p.id,p.name]))}} className="full"/><label className="field full"><span>Message *</span><textarea name="message" required minLength={10} rows={6} placeholder="Include the product, intended use, quantity or packaging details you already know."/></label><label className="hp" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><button className="button primary submit-button" disabled={status==="loading"||status==="success"}>{status==="loading"?"Sending…":status==="success"?"Enquiry received":"Send Enquiry"}<Send size={17}/></button><FormStatus status={status} error={error} id="form-status" success="Your enquiry was sent successfully. Ashutosh Trade will follow up after reviewing it."/></form>;
}

function ConsultationDialog({open,setOpen}:{open:boolean,setOpen:(open:boolean)=>void}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [error,setError]=useState(""); const [interest,setInterest]=useState<string[]>([]); const [contactMethod,setContactMethod]=useState("Phone"); const [consent,setConsent]=useState(false);
  const toggleInterest=(slug:string,checked:boolean)=>setInterest(current=>checked?[...current,slug]:current.filter(item=>item!==slug));
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(status==="loading"||status==="success")return;if(!interest.length){setStatus("error");setError("Select at least one product category of interest.");return}if(!consent){setStatus("error");setError("Please confirm that Ashutosh Trade may contact you about this request.");return}setStatus("loading");setError("");const payload=Object.fromEntries(new FormData(event.currentTarget).entries());try{await sendFormSubmission({...payload,"Form type":"Consultation request","Product categories":interest.join(", "),"Preferred contact":contactMethod,"Consent to contact":"Yes","Timezone":"Asia/Kathmandu","_subject":"New Ashutosh Trade consultation request","_template":"table","_replyto":String(payload.email||""),"_url":window.location.href,"_honey":String(payload.website||"")});setStatus("success")}catch(e){setStatus("error");setError(e instanceof Error?e.message:"Your consultation request could not be sent.")}};
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="consult-dialog"><DialogHeader><span className="eyebrow">Free consultation request</span><DialogTitle>Get a customized digital marketing plan</DialogTitle><DialogDescription>{consultationMessage}</DialogDescription></DialogHeader>{status==="success"?<div className="success-panel"><CheckCircle2/><h3>Your request is received</h3><p>We’ll review what you shared and contact you to confirm the consultation time.</p><button className="button secondary" onClick={()=>setOpen(false)}>Close</button></div>:<form onSubmit={submit} noValidate><div className="form-grid"><Field label="Full name *" name="fullName" required/><Field label="Business / organization *" name="organization" required/><Field label="Phone number *" name="phone" type="tel" required/><Field label="Email address *" name="email" type="email" required/><Field label="Business or facility type *" name="businessType" required/><SelectField label="Preferred contact method *" value={contactMethod} onChange={setContactMethod} options={["Phone","Email","WhatsApp"]}/><fieldset className="field full interest-field"><legend>Product categories of interest *</legend><div className="interest-grid">{categories.map(category=><label key={category.slug}><Checkbox checked={interest.includes(category.slug)} onCheckedChange={checked=>toggleInterest(category.slug,checked===true)} aria-label={category.shortName}/><span>{category.shortName}</span></label>)}</div></fieldset><label className="field full"><span>Main requirement or marketing challenge *</span><textarea name="message" required minLength={10} rows={4} placeholder="Tell us what you want to improve, what is currently difficult and what a useful outcome would look like."/></label><Field label="Preferred date *" name="preferredDate" type="date" required min={new Date().toISOString().slice(0,10)}/><Field label="Preferred time *" name="preferredTime" type="time" required/><label className="field full"><span>Additional notes</span><textarea name="additionalNotes" rows={3}/></label><label className="consent-row field full"><Checkbox checked={consent} onCheckedChange={checked=>setConsent(checked===true)} aria-label="Consent to be contacted"/><span>I agree that Ashutosh Trade may contact me about this request. *</span></label><label className="hp" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="timezone-note">Timezone: Asia/Kathmandu. Your preferred time is a request and will be confirmed after follow-up.</p><button className="button primary submit-button" disabled={status==="loading"}>{status==="loading"?"Sending request…":"Submit request"}</button><FormStatus status={status} error={error} id="consult-status" success=""/></form>}</DialogContent></Dialog>;
}

function CategoryGrid({detailed=false,homepage=false}:{detailed?:boolean,homepage?:boolean}) {
  const visibleCategories=categories
    .map((category,index)=>({category,index}))
    .filter(({category})=>!homepage||category.slug!=="guest-room-amenities");
  return <div className={`category-grid ${detailed?"detailed":""}`}>{visibleCategories.map(({category:c,index})=>{
    const imageNumber=String(index+1).padStart(2,"0");
    const displayName=homepage&&c.slug==="linens-guest-apparel"?"Room Amenities & Guest Apparel":detailed?c.name:c.shortName;
    const headingLines=homepageCategoryHeadings[c.slug];
    const heading=homepage&&headingLines?headingLines.filter(Boolean).join(" "):displayName;
    return <article className="category-card" key={c.slug}><Link className={`category-media tone-${index%5}`} href={`/products/${c.slug}`} aria-label={`View ${displayName}`}><Image src={`/assets/${imageNumber}.jpg`} fill sizes={detailed?"(max-width: 760px) 100vw, 33vw":"(max-width: 520px) 100vw, (max-width: 760px) 50vw, 33vw"} alt={`${displayName} product examples`}/>{detailed&&<span className="category-icon"><Icon name={c.icon} size={32}/></span>}</Link><h3>{heading}</h3>{homepage&&<div className="category-hover-copy"><p>{homepageCategoryDescriptions[c.slug]}</p><p className="category-hover-examples"><strong>May include:</strong> {homepageCategoryExamples[c.slug]}</p></div>}{!homepage&&<p>{c.description}</p>}{detailed&&<p className="examples"><strong>May include:</strong> {c.examples.join(", ")}.</p>}{!homepage&&<Link className="button secondary card-button" href={`/products/${c.slug}`}>View Products</Link>}</article>
  })}</div>;
}

function ProductGrid({items}:{items:Product[]}) { return <div className="product-grid">{items.map(p=>{const c=categoryBySlug[p.category];return <article className="product-card" key={p.id}><div className="product-visual" aria-label={`Illustrative category icon for ${p.name}`}><span className="product-icon"><Icon name={c.icon} size={30}/></span><small>{p.id}</small></div><div className="product-body"><div className="badge-row"><span className="sample-badge">Sample item</span><span className="type-badge">{p.type}</span></div><h3>{p.name}</h3><p>{p.description}</p><dl className="product-meta"><div><dt>Specifications</dt><dd>Confirm on enquiry</dd></div><div><dt>Packaging</dt><dd>Confirm on enquiry</dd></div></dl><div className="card-actions"><Link href="https://www.ashutoshtrade.com.np/contact?type=quote#enquiry-form">Request a Quote</Link></div></div></article>})}</div>; }

function SectionHead({eyebrow,title,copy,action}:{eyebrow:string,title:React.ReactNode,copy?:string,action?:React.ReactNode}) { return <div className="section-head"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{action}</div>; }
function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}) { return <section className="page-hero"><div className="shell page-hero-inner"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p>{actions&&<div className="hero-actions">{actions}</div>}</div></section>; }

function LegalPage({kind}:{kind:"privacy"|"terms"}) {
  const privacy=kind==="privacy";
  return <PageHero eyebrow="Ashutosh Trade" title={privacy?"Privacy Policy":"Terms"} copy={privacy?"For information about how details submitted through this website are handled, please contact Ashutosh Trade directly.":"For the current terms that apply to quotations, products, delivery and support, please contact Ashutosh Trade directly."} actions={<Link className="button secondary" href="/contact">Contact Us</Link>}/>;
}

function Footer() {return <footer className="site-footer"><div className="shell footer-grid"><div className="footer-intro"><Link className="brand logo-brand footer-brand" href="/" aria-label="Ashutosh Trade home"><Image src="/assets/ashutosh-trade-logo-white.png" width={668} height={203} alt="Ashutosh Trade"/></Link><p>A Nepal-based supplier of housekeeping products, facility essentials, cleaning machinery and related consumables, accessories and spare parts.</p></div><div className="footer-main-links">{mainLinks.filter(([h])=>h!=="/contact").map(([h,l])=><Link href={h} key={h}>{l}</Link>)}</div><div className="footer-product-links"><h2>Product Categories</h2><div className="footer-category-links">{categories.filter(c=>c.slug!=="guest-room-amenities").map(c=><Link href={`/products/${c.slug}`} key={c.slug}>{navigationCategoryName(c.slug,c.shortName)}</Link>)}</div></div><div><h2>CONTACT</h2><p className="footer-contact-line"><MapPin aria-hidden="true"/><span>{business.location}</span></p><p className="footer-contact-line"><Phone aria-hidden="true"/><span>{business.phone||"Phone number not yet supplied."}, 9715556165</span></p><p className="footer-contact-line"><Mail aria-hidden="true"/><span>{business.email||"Email address not yet supplied."}</span></p><p className="footer-contact-line"><Clock aria-hidden="true"/><span>{business.businessHours||"Operating hours not yet supplied."}</span></p><div className="social-icons" aria-label="Social media channels">{[["WhatsApp","whatsappw.png","whatsapp.png","https://wa.me/9779715556165"],["Facebook","facebookw.png","facebook.png","https://facebook.com/ashutosh.trade"],["Instagram","instagramw.png","instagram.png","https://instagram.com/ashutosh.trade"],["TikTok","tiktokw.png","tiktok.png","https://tiktok.com/@ashutosh.trade"]].map(([label,whiteFile,colorFile,url])=><a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} key={label}><span><Image className="social-icon-white" src={`/assets/${whiteFile}`} width={22} height={22} alt=""/><Image className="social-icon-color" src={`/assets/${colorFile}`} width={22} height={22} alt=""/></span></a>)}</div></div></div><div className="shell footer-legal-links"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Ashutosh Trade. All rights reserved.</span><div className="footer-proof" aria-label="Ashutosh Trade service benefits"><span><Check aria-hidden="true"/>Tailored recommendations</span><span><Check aria-hidden="true"/>Branded or generic</span><span><Check aria-hidden="true"/>Dependable support</span></div></div></footer>}

function Field({label,name,type="text",required,placeholder,min}:{label:string,name:string,type?:string,required?:boolean,placeholder?:string,min?:string}) {return <label className="field"><span>{label}</span><input name={name} type={type} required={required} placeholder={placeholder} min={min}/></label>}
function SelectField({label,value,onChange,options,labels={},className=""}:{label:string,value:string,onChange:(v:string)=>void,options:string[],labels?:Record<string,string>,className?:string}) {return <div className={`field ${className}`}><span>{label}</span><Select value={value} onValueChange={v=>onChange(v??options[0])}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o} value={o}>{labels[o]||o}</SelectItem>)}</SelectContent></Select></div>}
function FormStatus({status,error,id,success}:{status:string,error:string,id:string,success:string}) {if(status!=="success"&&status!=="error")return <p id={id} className="sr-only" aria-live="polite">{status==="loading"?"Submitting form":""}</p>;return <div id={id} className={`form-status ${status}`} role={status==="error"?"alert":"status"}>{status==="success"?<CheckCircle2/>:<AlertCircle/>}<p>{status==="success"?success:error}</p></div>}
