"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight, BedDouble, BrushCleaning, Building2, Check, ChevronDown, ClipboardList,
  Cog, FlaskConical, Hand, HeartPulse, Hotel, Menu, MessageSquareText, PanelTop, RotateCcw,
  School, Search, ShieldCheck, Shirt, Sparkles, ScrollText, Send, SlidersHorizontal,
  Wind, X, BriefcaseBusiness, PackageSearch, MapPin, Box, CheckCircle2, AlertCircle
} from "lucide-react";
import { categories, categoryBySlug, consultationMessage, productById, products, type Product } from "@/lib/site-data";
import { business } from "@/lib/business-config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconMap = { FlaskConical, BrushCleaning, Cog, ScrollText, PanelTop, Hand, Wind, BedDouble, Shirt, ShieldCheck };
const Icon = ({ name, size=22 }:{name:string,size?:number}) => { const Component = iconMap[name as keyof typeof iconMap] || Box; return <Component size={size}/>; };
const mainLinks = [["/","Home"],["/about","About Us"],["/products","Products"],["/catalogue","Catalogue"],["/contact","Contact"]];
const isCurrent = (pathname:string, href:string) => href === "/" ? pathname === "/" : pathname === href || (href === "/products" && pathname.startsWith("/products/"));

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
      description:"Open the digital marketing consultation request form on Ashutosh Trade’s website. This does not confirm a booking.",
      inputSchema:{type:"object",properties:{},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:(input:unknown) => { if (!input || typeof input !== "object" || Object.keys(input as Record<string,unknown>).length) throw new Error("This tool does not accept input fields."); setConsultOpen(true); return {status:"form_opened",confirmation_required:true}; }
    },{signal:lifecycle.signal})).catch(()=>{});
    return () => lifecycle.abort();
  },[]);

  return <>
    <Header pathname={pathname} openConsult={openConsult}/>
    <main id="main-content">
      {pathname === "/" && <Home openConsult={openConsult}/>} 
      {pathname === "/about" && <About openConsult={openConsult}/>} 
      {pathname === "/products" && <ProductsOverview/>}
      {pathname === "/catalogue" && <Catalogue/>}
      {pathname === "/contact" && <Contact openConsult={openConsult}/>} 
      {pathname.startsWith("/products/") && <CategoryPage slug={pathname.replace("/products/","")}/>} 
    </main>
    <Footer openConsult={openConsult}/>
    <ConsultationDialog open={consultOpen} setOpen={setConsultOpen}/>
  </>;
}

function Header({pathname,openConsult}:{pathname:string,openConsult:()=>void}) {
  const [productsOpen,setProductsOpen]=useState(false);
  useEffect(()=>{ const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setProductsOpen(false)}; document.addEventListener("keydown",close); return()=>document.removeEventListener("keydown",close)},[]);
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Ashutosh Trade home"><span className="brand-mark">AT</span><span><strong>Ashutosh Trade</strong><small>Kathmandu, Nepal</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {mainLinks.map(([href,label]) => href === "/products" ? <div className="nav-products" key={href}>
          <span className="nav-combo"><a href={href} aria-current={isCurrent(pathname,href)?"page":undefined}>{label}</a><button onClick={()=>setProductsOpen(!productsOpen)} aria-label="Show product categories" aria-expanded={productsOpen}><ChevronDown size={16}/></button></span>
          {productsOpen && <div className="mega-menu"><div><p className="menu-kicker">Product categories</p><h2>Find supplies by requirement</h2><p>All catalogue items are illustrative until inventory is verified.</p><a className="text-link" href="/products">View all categories <ArrowUpRight size={15}/></a></div><div className="mega-links">{categories.map(c=><a key={c.slug} href={`/products/${c.slug}`}><span className="category-mini"><Icon name={c.icon} size={18}/></span>{c.shortName}</a>)}</div></div>}
        </div> : <a key={href} href={href} aria-current={isCurrent(pathname,href)?"page":undefined}>{label}</a>)}
      </nav>
      <button className="button primary header-cta" onClick={openConsult}>Book a Free Consultation Call</button>
      <Sheet>
        <SheetTrigger asChild><button className="menu-button" aria-label="Open navigation"><Menu/></button></SheetTrigger>
        <SheetContent className="mobile-sheet"><SheetHeader><SheetTitle>Ashutosh Trade</SheetTitle><SheetDescription>Housekeeping and facility supplies in Kathmandu.</SheetDescription></SheetHeader>
          <nav className="mobile-nav" aria-label="Mobile navigation">{mainLinks.map(([href,label])=><SheetClose asChild key={href}><a href={href} aria-current={isCurrent(pathname,href)?"page":undefined}>{label}</a></SheetClose>)}
          <details><summary>Product categories <ChevronDown size={16}/></summary><div>{categories.map(c=><SheetClose asChild key={c.slug}><a href={`/products/${c.slug}`}>{c.shortName}</a></SheetClose>)}</div></details></nav>
          <div className="mobile-cta"><button className="button primary" onClick={openConsult}>Book a Free Consultation Call</button><small>Free digital marketing consultation request. Times are confirmed by Ashutosh Trade.</small></div>
        </SheetContent>
      </Sheet>
    </header>
  </>;
}

function Home({openConsult}:{openConsult:()=>void}) {
  const industries = [
    [HeartPulse,"Hospitals & healthcare","Housekeeping, paper, hygiene and facility supplies selected around each facility’s operational requirements."],
    [School,"Schools & education","Practical supplies for classrooms, washrooms, common areas and routine campus upkeep."],
    [Hotel,"Hotels & hospitality","Guest amenities, linens, room care, paper products and housekeeping equipment."],
    [Building2,"Commercial buildings","Consumables, tools and machinery options for shared spaces and building-service teams."],
    [BriefcaseBusiness,"Offices","Everyday washroom, air-care, paper and cleaning supplies for workplace facilities."],
  ] as const;
  return <>
    <section className="hero shell">
      <div className="hero-copy"><span className="eyebrow"><Building2 size={16}/> Kathmandu-based supply partner</span><h1>Housekeeping, Facility &amp; Cleaning Supplies for Your Business</h1><p className="lead">Ashutosh Trade provides branded and generic housekeeping supplies, facility products, and cleaning machinery tailored to the requirements of hospitals, schools, hotels, offices, and commercial buildings in Kathmandu, Nepal.</p>
        <div className="hero-actions"><button className="button primary" onClick={openConsult}>Book a Free Consultation Call</button><a className="button secondary" href="/products">Explore Products</a></div><p className="consult-note"><Sparkles size={16}/> This is a free digital marketing consultation for your business.</p><div className="proof-row"><span><Check/> Branded &amp; generic options</span><span><Check/> Requirement-led selection</span><span><Check/> Institutional supply focus</span></div></div>
      <div className="hero-media"><Image src="/assets/ashutosh-trade-supplies.png" fill priority sizes="(max-width: 900px) 100vw, 48vw" alt="A brand-neutral range of housekeeping supplies and cleaning equipment in a modern facility setting"/><div className="hero-caption"><strong>Practical product sourcing</strong><span>Options matched to your requirements and budget.</span></div></div>
    </section>
    <section className="section shell"><SectionHead eyebrow="Explore the range" title="Supplies organized around the work you do" copy="Browse ten product categories, then share the exact format, quantity or use case you need." action={<a className="button secondary" href="/products">Explore Products</a>}/><CategoryGrid/></section>
    <section className="section section-tint"><div className="shell"><SectionHead eyebrow="Industries we serve" title="Built around institutional requirements" copy="Different facilities have different routines, teams and budgets. We help buyers narrow the options without overstating what has not yet been verified."/><div className="industry-grid">{industries.map(([I,title,copy])=><article className="industry-card" key={title}><I/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section shell split-feature"><div><span className="eyebrow">Why Ashutosh Trade</span><h2>A practical partner for a broad range of facility needs</h2><p>We focus on understanding the requirement first, then discussing suitable options across the categories we supply.</p><a className="text-link" href="/about">About our approach <ArrowUpRight size={16}/></a></div><div className="feature-list">{[[PackageSearch,"Branded and generic options","Compare approaches that suit the requirement and budget."],[SlidersHorizontal,"Selected around your needs","Start with the use case rather than a one-size-fits-all recommendation."],[Box,"Broad category coverage","Bring related housekeeping, facility and hospitality enquiries together."],[MapPin,"Kathmandu-based business","Work with a local business serving institutional and commercial buyers."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></section>
    <section className="section process-section"><div className="shell"><SectionHead eyebrow="How enquiries work" title="A clear path from requirement to quotation"/><ol className="process-list"><li><span>01</span><h3>Share your requirements.</h3><p>Tell us the facility type, category and what you need the product to do.</p></li><li><span>02</span><h3>Discuss suitable product options.</h3><p>Review relevant branded or generic options and the information available.</p></li><li><span>03</span><h3>Request a tailored quotation.</h3><p>Ask for commercial information once the product requirement is clear.</p></li></ol></div></section>
    <section className="section shell"><SectionHead eyebrow="Catalogue preview" title="Start with illustrative product types" copy="These examples show the kinds of enquiries Ashutosh Trade can discuss. They are not a confirmed stock list." action={<a className="button secondary" href="/catalogue">Browse Catalogue</a>}/><ProductGrid items={products.slice(0,4)}/></section>
    <ConsultationBand openConsult={openConsult}/>
    <section className="section shell faq-section"><SectionHead eyebrow="FAQ" title="Practical answers before you enquire"/><Accordion type="single" collapsible>{[
      ["What product categories does Ashutosh Trade cover?","The range spans cleaning and laundry chemicals, tools, machinery and spare parts, papers and disposables, dispensers, hand hygiene, air care, guest amenities, linens and pest-management supplies."],
      ["Can I ask for branded or generic options?","Yes. Ashutosh Trade can discuss branded and generic approaches based on your stated requirements. Specific brands are only presented after they are verified."],
      ["How should an institutional buyer make an enquiry?","Share the organization, product category, intended use and any known quantities or packaging needs. Ashutosh Trade can then discuss suitable product options and a tailored quotation."],
      ["Is every catalogue item currently available?","No. The catalogue uses clearly marked illustrative examples until Ashutosh Trade provides a verified inventory. Submit a product enquiry to confirm suitable options."],
      ["Can I download a PDF catalogue?","A verified PDF catalogue has not been supplied. Use the Request Catalogue action and Ashutosh Trade can follow up with available information."],
    ].map(([q,a],i)=><AccordionItem value={`faq-${i}`} key={q}><AccordionTrigger className="faq-trigger">{q}</AccordionTrigger><AccordionContent><p>{a}</p></AccordionContent></AccordionItem>)}</Accordion></section>
  </>;
}

function About({openConsult}:{openConsult:()=>void}) { return <>
  <PageHero eyebrow="About Ashutosh Trade" title="A practical supply partner for organizations in Kathmandu" copy="Ashutosh Trade supplies housekeeping products, facility products, cleaning machinery and related consumables, equipment, accessories and spare parts."/>
  <section className="section shell about-grid"><div><h2>Start with the requirement</h2><p>Institutional and commercial buyers often need to balance product format, routine, budget and compatibility. Ashutosh Trade’s approach is to understand those requirements before discussing relevant options.</p><p>The business serves hospitals and healthcare facilities, schools, hotels, commercial buildings, offices and other organizations with housekeeping and facility-management needs.</p><div className="inline-actions"><a className="button primary" href="/products">Explore Products</a><a className="button secondary" href="/contact">Contact Us</a></div></div><aside className="info-panel"><span className="panel-icon"><MapPin/></span><p className="eyebrow">Business location</p><h3>Kathmandu, Nepal</h3><p>No street address, phone number, email address or business hours have been published because verified details have not yet been supplied.</p></aside></section>
  <section className="section section-tint"><div className="shell two-column"><div><span className="eyebrow">Product approach</span><h2>Branded and generic, without forcing one route</h2></div><div><p>A branded option may suit buyers who have a known specification or preference. A generic option may suit buyers who want to compare alternatives around the same practical need.</p><p>Specific brands, specifications, packaging and availability are confirmed through the enquiry process rather than assumed in the public catalogue.</p></div></div></section>
  <ConsultationBand openConsult={openConsult}/>
  </>; }

function ProductsOverview() { return <><PageHero eyebrow="Products" title="Ten categories for housekeeping and facility requirements" copy="Use these categories to identify the kind of product you need. Listed examples are illustrative until Ashutosh Trade provides a verified inventory." actions={<><a className="button primary" href="/catalogue">Browse Catalogue</a><a className="button secondary" href="/contact?type=quote">Request a Quote</a></>}/><section className="section shell"><CategoryGrid detailed/></section><section className="section requirement-band"><div className="shell two-column"><div><span className="eyebrow light">Share a specific requirement</span><h2>Need a particular format, accessory or supply type?</h2></div><div><p>Tell us what the product will be used for and whether you want branded, generic or both kinds of options. We’ll use your enquiry to discuss relevant choices.</p><a className="button light-button" href="/contact?type=quote">Request a Quote</a></div></div></section></>; }

function CategoryPage({slug}:{slug:string}) {
  const category=categoryBySlug[slug]; const [type,setType]=useState("all"); if(!category)return null;
  const items=products.filter(p=>p.category===slug && (type==="all"||p.type===type));
  return <><section className="page-hero"><div className="shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span><span aria-current="page">{category.shortName}</span></nav><div className="page-hero-grid"><div><span className="eyebrow">Product category</span><h1>{category.name}</h1><p>{category.intro}</p><div className="hero-actions"><a className="button primary" href={`/contact?type=quote&category=${category.slug}`}>Request a Quote</a><a className="button secondary" href="/catalogue">Browse Catalogue</a></div></div><span className="large-icon"><Icon name={category.icon} size={50}/></span></div></div></section>
    <section className="section shell category-layout"><aside className="use-panel"><h2>Relevant business uses</h2><ul>{category.uses.map(u=><li key={u}><Check size={17}/>{u}</li>)}</ul><p className="sample-note">Examples are illustrative and do not confirm inventory, specifications or performance.</p></aside><div><div className="catalogue-heading"><div><span className="eyebrow">Illustrative products</span><h2>Product types in this category</h2></div><div className="filter-field"><label>Option type</label><Select value={type} onValueChange={v=>setType(v??"all")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All options</SelectItem><SelectItem value="Branded option">Branded option</SelectItem><SelectItem value="Generic option">Generic option</SelectItem></SelectContent></Select></div></div><ProductGrid items={items}/></div></section>
    <section className="section section-tint"><div className="shell"><SectionHead eyebrow="Related categories" title="Continue exploring"/><div className="related-links">{category.related.map(r=>{const c=categoryBySlug[r];return <a key={r} href={`/products/${r}`}><span><Icon name={c.icon}/></span><strong>{c.shortName}</strong><ArrowUpRight/></a>})}</div></div></section>
    <section className="section shell action-strip"><div><h2>Have a product requirement?</h2><p>Share the use case and ask for relevant branded or generic options.</p></div><div><a className="button primary" href={`/contact?type=quote&category=${category.slug}`}>Request a Quote</a><a className="button secondary" href="/contact">Contact Us</a></div></section>
  </>;
}

function Catalogue() {
  const params = typeof window!=="undefined" ? new URLSearchParams(window.location.search) : null;
  const [search,setSearch]=useState(""); const [category,setCategory]=useState("all"); const [type,setType]=useState("all"); const [selected,setSelected]=useState<Product|null>(()=>params?.get("product")?productById[params.get("product")!]:null);
  const filtered=useMemo(()=>products.filter(p=>{const q=search.trim().toLowerCase();return (!q||`${p.name} ${p.description}`.toLowerCase().includes(q))&&(category==="all"||p.category===category)&&(type==="all"||p.type===type)}),[search,category,type]);
  const reset=()=>{setSearch("");setCategory("all");setType("all")};
  const openProduct=(product:Product)=>{setSelected(product);history.replaceState(null,"",`/catalogue?product=${product.id}`)};
  const closeProduct=(open:boolean)=>{if(!open){setSelected(null);history.replaceState(null,"","/catalogue")}};
  return <><PageHero eyebrow="Catalogue" title="Search product examples by need" copy="Search and filter illustrative items, review the available information, then request verified product details or a quotation. No prices or stock claims are shown." actions={business.cataloguePdfUrl?<a className="button primary" href={business.cataloguePdfUrl} download>Download Catalogue</a>:<a className="button primary" href="/contact?type=catalogue">Request Catalogue</a>}/>
    <section className="section shell"><div className="catalogue-tools"><div className="search-field"><label htmlFor="catalogue-search">Search products</label><span><Search/><input id="catalogue-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or description"/></span></div><div className="filter-field"><label>Category</label><Select value={category} onValueChange={v=>setCategory(v??"all")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map(c=><SelectItem value={c.slug} key={c.slug}>{c.shortName}</SelectItem>)}</SelectContent></Select></div><div className="filter-field"><label>Option type</label><Select value={type} onValueChange={v=>setType(v??"all")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All options</SelectItem><SelectItem value="Branded option">Branded option</SelectItem><SelectItem value="Generic option">Generic option</SelectItem></SelectContent></Select></div><button className="reset-button" onClick={reset}><RotateCcw/> Reset filters</button></div>
    <div className="results-bar"><p><strong>{filtered.length}</strong> {filtered.length===1?"result":"results"}</p><span>All items are sample data until verified.</span></div>
    {filtered.length?<ProductGrid items={filtered} onOpen={openProduct}/>:<div className="empty-state"><Search/><h2>No products match these filters</h2><p>Try a broader search or reset the filters to view all illustrative items.</p><button className="button secondary" onClick={reset}>Reset filters</button></div>}</section>
    <ProductDialog product={selected} open={!!selected} onOpenChange={closeProduct}/>
  </>;
}

function Contact({openConsult}:{openConsult:()=>void}) {
  const params=typeof window!=="undefined"?new URLSearchParams(window.location.search):null;
  const initialType=params?.get("type")==="quote"?"Product quotation":params?.get("type")==="catalogue"?"Catalogue request":"General enquiry";
  const initialProduct=params?.get("product")||"none"; const linkedProduct=initialProduct!=="none"?productById[initialProduct]:null;
  const [fields,setFields]=useState({enquiryType:initialType,category:params?.get("category")||linkedProduct?.category||"none",product:initialProduct});
  return <><PageHero eyebrow="Contact Ashutosh Trade" title="Share your requirement" copy="Tell us what your organization needs. Product details, quantities and specifications can be discussed before a quotation is prepared."/>
    <section className="section shell contact-layout"><div><InquiryForm fields={fields} setFields={setFields}/></div><aside className="contact-aside"><div className="info-panel"><span className="panel-icon"><MapPin/></span><p className="eyebrow">Location</p><h2>{business.location}</h2>{business.streetAddress&&<p>{business.streetAddress}</p>}{business.phone&&<p><a href={`tel:${business.phone}`}>{business.phone}</a></p>}{business.email&&<p><a href={`mailto:${business.email}`}>{business.email}</a></p>}{business.businessHours&&<p>{business.businessHours}</p>}{!business.phone&&!business.email&&!business.businessHours&&<p>Verified street address, phone, email and business hours have not yet been supplied, so unavailable contact methods are not displayed.</p>}</div><div className="consult-card"><Sparkles/><h2>Free digital marketing consultation</h2><p>This separate consultation covers your business’s digital marketing challenges and goals.</p><button className="button primary" onClick={openConsult}>Book a Free Consultation Call</button><small>Your preferred time is a request and will be confirmed by Ashutosh Trade.</small></div></aside></section>
  </>;
}

function InquiryForm({fields,setFields}:{fields:{enquiryType:string,category:string,product:string},setFields:(v:{enquiryType:string,category:string,product:string})=>void}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [error,setError]=useState(""); const token=useRef(crypto.randomUUID()); const started=useRef(Date.now());
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(status==="loading"||status==="success")return;setStatus("loading");setError("");const form=new FormData(event.currentTarget);const payload=Object.fromEntries(form.entries());try{const response=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,...fields,kind:"enquiry",clientToken:token.current,formStartedAt:started.current})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Your enquiry could not be sent.");setStatus("success")}catch(e){setStatus("error");setError(e instanceof Error?e.message:"Your enquiry could not be sent.")}};
  return <form className="form-card" onSubmit={submit} aria-describedby="form-status"><div className="form-heading"><span className="eyebrow">Enquiry form</span><h2>How can we help?</h2><p>Required fields are marked with an asterisk.</p></div><div className="form-grid"><Field label="Full name *" name="fullName" required/><Field label="Organization *" name="organization" required/><Field label="Email *" name="email" type="email" required/><Field label="Phone" name="phone" type="tel"/><SelectField label="Enquiry type *" value={fields.enquiryType} onChange={v=>setFields({...fields,enquiryType:v})} options={["General enquiry","Product quotation","Product information","Catalogue request"]}/><SelectField label="Product category" value={fields.category} onChange={v=>setFields({...fields,category:v})} options={["none",...categories.map(c=>c.slug)]} labels={{none:"Not selected",...Object.fromEntries(categories.map(c=>[c.slug,c.shortName]))}}/><SelectField label="Selected product" value={fields.product} onChange={v=>setFields({...fields,product:v})} options={["none",...products.map(p=>p.id)]} labels={{none:"Not selected",...Object.fromEntries(products.map(p=>[p.id,p.name]))}} className="full"/><label className="field full"><span>Message *</span><textarea name="message" required minLength={10} rows={6} placeholder="Include the product, intended use, quantity or packaging details you already know."/></label><label className="hp" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><button className="button primary submit-button" disabled={status==="loading"||status==="success"}>{status==="loading"?"Sending…":status==="success"?"Enquiry received":"Send Enquiry"}<Send size={17}/></button><FormStatus status={status} error={error} id="form-status" success="Your enquiry was received and stored. Ashutosh Trade can follow up after reviewing it."/></form>;
}

function ConsultationDialog({open,setOpen}:{open:boolean,setOpen:(open:boolean)=>void}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [error,setError]=useState(""); const token=useRef(crypto.randomUUID()); const started=useRef(Date.now());
  useEffect(()=>{if(open&&status!=="success"){started.current=Date.now()}},[open,status]);
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(status==="loading"||status==="success")return;setStatus("loading");setError("");const payload=Object.fromEntries(new FormData(event.currentTarget).entries());try{const response=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,kind:"consultation",clientToken:token.current,formStartedAt:started.current,timezone:"Asia/Kathmandu"})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Your consultation request could not be sent.");setStatus("success")}catch(e){setStatus("error");setError(e instanceof Error?e.message:"Your consultation request could not be sent.")}};
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="consult-dialog"><DialogHeader><span className="eyebrow">Digital marketing consultation</span><DialogTitle>Book a Free Consultation Call</DialogTitle><DialogDescription>{consultationMessage}</DialogDescription></DialogHeader>{status==="success"?<div className="success-panel"><CheckCircle2/><h3>Consultation request received</h3><p>Your preferred date and time are not automatically confirmed. Ashutosh Trade will contact you to confirm the consultation.</p><button className="button secondary" onClick={()=>setOpen(false)}>Close</button></div>:<form onSubmit={submit}><div className="form-grid"><Field label="Full name *" name="fullName" required/><Field label="Business / organization *" name="organization" required/><Field label="Email *" name="email" type="email" required/><Field label="Phone *" name="phone" type="tel" required/><Field label="Business type *" name="businessType" required/><Field label="Business website" name="businessWebsite" type="url" placeholder="https://"/><label className="field full"><span>Current digital marketing challenge or goal *</span><textarea name="message" required minLength={10} rows={4}/></label><Field label="Preferred date *" name="preferredDate" type="date" required min={new Date().toISOString().slice(0,10)}/><Field label="Preferred time *" name="preferredTime" type="time" required/><label className="field full"><span>Additional notes</span><textarea name="additionalNotes" rows={3}/></label><label className="hp" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="timezone-note">Timezone: Asia/Kathmandu. This is a consultation request; the time is confirmed only after follow-up.</p><button className="button primary submit-button" disabled={status==="loading"}>{status==="loading"?"Sending request…":"Request Consultation"}</button><FormStatus status={status} error={error} id="consult-status" success=""/></form>}</DialogContent></Dialog>;
}

function ProductDialog({product,open,onOpenChange}:{product:Product|null,open:boolean,onOpenChange:(open:boolean)=>void}) { if(!product)return null; const category=categoryBySlug[product.category];return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="product-dialog"><DialogHeader><span className="sample-badge">Illustrative sample</span><DialogTitle>{product.name}</DialogTitle><DialogDescription>{category.shortName}</DialogDescription></DialogHeader><div className="product-detail-media"><Image src={product.image} fill sizes="600px" alt={product.imageAlt}/></div><p>{product.description}</p><dl className="detail-list"><div><dt>Reference ID</dt><dd>{product.id}</dd></div><div><dt>Option type</dt><dd>{product.type}</dd></div><div><dt>Verified brand</dt><dd>Not provided</dd></div><div><dt>Specifications / packaging</dt><dd>Confirm on enquiry</dd></div></dl><p className="sample-note">This record is sample data and does not confirm inventory, price, specification, packaging or availability.</p><a className="button primary" href={`/contact?type=quote&category=${product.category}&product=${product.id}`}>Request a Quote</a></DialogContent></Dialog>; }

function CategoryGrid({detailed=false}:{detailed?:boolean}) { return <div className={`category-grid ${detailed?"detailed":""}`}>{categories.map(c=><article className="category-card" key={c.slug}><span className="category-icon"><Icon name={c.icon}/></span><h3>{c.name}</h3><p>{c.description}</p>{detailed&&<p className="examples"><strong>May include:</strong> {c.examples.join(", ")}.</p>}<a href={`/products/${c.slug}`}>View category <ArrowUpRight size={16}/></a></article>)}</div>; }

function ProductGrid({items,onOpen}:{items:Product[],onOpen?:(p:Product)=>void}) { return <div className="product-grid">{items.map(p=>{const c=categoryBySlug[p.category];return <article className="product-card" key={p.id}><button className="product-visual" onClick={()=>onOpen?.(p)} aria-label={`View details for ${p.name}`} disabled={!onOpen}><span><Icon name={c.icon} size={34}/></span><small>{p.id}</small></button><div className="product-body"><div className="badge-row"><span className="sample-badge">Sample item</span><span className="type-badge">{p.type}</span></div><h3>{p.name}</h3><p>{p.description}</p><div className="card-actions">{onOpen?<button className="text-link" onClick={()=>onOpen(p)}>View details</button>:<a className="text-link" href={`/catalogue?product=${p.id}`}>View details</a>}<a href={`/contact?type=quote&category=${p.category}&product=${p.id}`}>Request a Quote</a></div></div></article>})}</div>; }

function SectionHead({eyebrow,title,copy,action}:{eyebrow:string,title:string,copy?:string,action?:React.ReactNode}) { return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{action}</div>; }
function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}) { return <section className="page-hero"><div className="shell page-hero-inner"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p>{actions&&<div className="hero-actions">{actions}</div>}</div></section>; }
function ConsultationBand({openConsult}:{openConsult:()=>void}) { return <section className="section shell"><div className="consult-band"><div><span className="eyebrow light">A separate digital marketing offer</span><h2>Build a practical next-step marketing plan</h2><p>{consultationMessage}</p></div><div><button className="button light-button" onClick={openConsult}>Book a Free Consultation Call</button><small>Asia/Kathmandu timezone. Your requested time is confirmed after follow-up.</small></div></div></section>; }

function Footer({openConsult}:{openConsult:()=>void}) {return <footer className="site-footer"><div className="shell footer-grid"><div><a className="brand footer-brand" href="/"><span className="brand-mark">AT</span><span><strong>Ashutosh Trade</strong><small>Kathmandu, Nepal</small></span></a><p>Housekeeping supplies, facility products, cleaning machinery and related requirements for institutional and commercial buyers.</p><button className="button light-button" onClick={openConsult}>Book a Free Consultation Call</button></div><div><h2>Main pages</h2>{mainLinks.map(([h,l])=><a href={h} key={h}>{l}</a>)}</div><div className="footer-categories"><h2>Product categories</h2>{categories.map(c=><a href={`/products/${c.slug}`} key={c.slug}>{c.shortName}</a>)}</div><div><h2>Location</h2><p>Kathmandu, Nepal</p><p>Contact details will appear here once verified and configured.</p></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Ashutosh Trade. All rights reserved.</span><span>Illustrative catalogue content is clearly marked.</span></div></footer>}

function Field({label,name,type="text",required,placeholder,min}:{label:string,name:string,type?:string,required?:boolean,placeholder?:string,min?:string}) {return <label className="field"><span>{label}</span><input name={name} type={type} required={required} placeholder={placeholder} min={min}/></label>}
function SelectField({label,value,onChange,options,labels={},className=""}:{label:string,value:string,onChange:(v:string)=>void,options:string[],labels?:Record<string,string>,className?:string}) {return <div className={`field ${className}`}><span>{label}</span><Select value={value} onValueChange={v=>onChange(v??options[0])}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o} value={o}>{labels[o]||o}</SelectItem>)}</SelectContent></Select></div>}
function FormStatus({status,error,id,success}:{status:string,error:string,id:string,success:string}) {if(status!=="success"&&status!=="error")return <p id={id} className="sr-only" aria-live="polite">{status==="loading"?"Submitting form":""}</p>;return <div id={id} className={`form-status ${status}`} role={status==="error"?"alert":"status"}>{status==="success"?<CheckCircle2/>:<AlertCircle/>}<p>{status==="success"?success:error}</p></div>}
