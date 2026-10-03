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
const mainLinks = [["/","Home"],["/#challenges","Your Challenges"],["/#services","Services"],["/#process","How It Works"],["/contact","Free Plan"]];
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
      description:"Open the request form for a free customized digital marketing plan. This does not confirm a booking.",
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
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <a className="brand logo-brand" href="/" aria-label="Ashutosh Trade home"><Image src="/assets/ashutosh-trade-logo.png" width={652} height={179} priority alt="Ashutosh Trade"/></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {mainLinks.map(([href,label]) => <a key={href} href={href} aria-current={isCurrent(pathname,href)?"page":undefined}>{label}</a>)}
      </nav>
      <button className="button primary header-cta" onClick={openConsult}>Get My Free Plan</button>
      <Sheet>
        <SheetTrigger asChild><button className="menu-button" aria-label="Open navigation"><Menu/></button></SheetTrigger>
        <SheetContent className="mobile-sheet"><SheetHeader><SheetTitle>Ashutosh Trade</SheetTitle><SheetDescription>AI-powered digital marketing with a clear, practical plan.</SheetDescription></SheetHeader>
          <nav className="mobile-nav" aria-label="Mobile navigation">{mainLinks.map(([href,label])=><SheetClose asChild key={href}><a href={href} aria-current={isCurrent(pathname,href)?"page":undefined}>{label}</a></SheetClose>)}
          </nav>
          <div className="mobile-cta"><button className="button primary" onClick={openConsult}>Get My Free Marketing Plan</button><small>Share your biggest challenge. We’ll turn it into clear next steps.</small></div>
        </SheetContent>
      </Sheet>
    </header>
  </>;
}

function Home({openConsult}:{openConsult:()=>void}) {
  const challenges = [
    [MessageSquareText,"You post, but people do not respond","Your content takes time to create, yet it brings few enquiries or sales."],
    [Search,"Customers cannot find you","Your ideal customers are searching online, but competitors appear first."],
    [SlidersHorizontal,"Marketing feels scattered","Social media, ads and your website are active, but they do not work together."],
    [ClipboardList,"You do not know what to do next","Too many tools and opinions make it hard to choose the right priority."],
    [BriefcaseBusiness,"You are too busy to manage it all","Marketing keeps falling behind while you focus on running the business."],
  ] as const;
  return <>
    <section className="hero shell">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={16}/> AI-powered digital marketing</span><h1>Stop guessing. Start marketing with a clear plan.</h1><p className="lead">When your marketing feels random, you lose time, money and good customers. We use AI-powered insights and practical human strategy to show you what to do, why it matters and what to focus on first.</p>
        <div className="hero-actions"><button className="button primary" onClick={openConsult}>Get My Free Marketing Plan</button><a className="button secondary" href="#process">See How It Works</a></div><p className="consult-note"><Sparkles size={16}/> No ready-made package. Your plan is built around your business.</p><div className="proof-row"><span><Check/> Clear priorities</span><span><Check/> Less wasted effort</span><span><Check/> A plan you can act on</span></div></div>
      <div className="hero-media marketing-visual" aria-label="Preview of a customized marketing plan"><div className="plan-preview"><span className="eyebrow light">Your customized plan</span><h2>A simple path from attention to action</h2><ol><li><span>01</span><div><strong>Find the right audience</strong><small>Know who to reach and where they spend time.</small></div></li><li><span>02</span><div><strong>Share the right message</strong><small>Use content that speaks to a real need.</small></div></li><li><span>03</span><div><strong>Turn interest into enquiries</strong><small>Make the next step clear and easy.</small></div></li></ol><p><Sparkles size={17}/> AI finds the patterns. Human strategy turns them into a practical plan.</p></div></div>
    </section>
    <section className="section section-tint" id="challenges"><div className="shell"><SectionHead eyebrow="Does this sound familiar?" title="Marketing should help your business grow—not create more confusion" copy="Most growing businesses do not need more random posts or another tool. They need a clear system that connects attention, trust and enquiries."/><div className="industry-grid">{challenges.map(([I,title,copy])=><article className="industry-card" key={title}><I/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section shell split-feature" id="services"><div><span className="eyebrow">The bridge to better growth</span><h2>AI-powered insight, turned into simple action</h2><p>AI helps us study search behavior, content gaps, customer questions and campaign data faster. We add human judgment to turn those insights into a focused plan that fits your goals, time and budget.</p><a className="text-link" href="/about">See our approach <ArrowUpRight size={16}/></a></div><div className="feature-list">{[[Search,"Search visibility","Help the right people find your business when they are ready to act."],[MessageSquareText,"Content strategy","Plan useful content that answers questions and builds trust."],[SlidersHorizontal,"Smarter campaigns","Focus ads and promotions on the audiences and messages that matter."],[ClipboardList,"Clear reporting","Understand what is working, what is not and what to improve next."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></section>
    <section className="section process-section" id="process"><div className="shell"><SectionHead eyebrow="How it works" title="From marketing confusion to a clear next step"/><ol className="process-list"><li><span>01</span><h3>Tell us what feels stuck</h3><p>In a free consultation, we learn about your business, customers, goals and current marketing.</p></li><li><span>02</span><h3>We find the best opportunities</h3><p>We use AI-supported research and practical experience to identify gaps, priorities and quick wins.</p></li><li><span>03</span><h3>Receive your customized plan</h3><p>You get clear recommendations for the channels, messages and actions that deserve attention first.</p></li></ol></div></section>
    <section className="section shell"><SectionHead eyebrow="What you receive" title="A free plan built for your business" copy="You will leave the consultation with direction—not more marketing jargon."/><div className="feature-list">{[[CheckCircle2,"Your main growth gaps","A clear view of what may be blocking attention, trust or enquiries."],[CheckCircle2,"Your best next steps","A short list of actions ordered by importance, not a long wish list."],[CheckCircle2,"The right channels","Guidance on where search, social, content or ads can support your goals."],[CheckCircle2,"A practical starting point","Recommendations shaped around your current resources and budget."]].map(([I,t,c])=><article key={t as string}><span><I/></span><div><h3>{t as string}</h3><p>{c as string}</p></div></article>)}</div></section>
    <ConsultationBand openConsult={openConsult}/>
    <section className="section shell faq-section"><SectionHead eyebrow="FAQ" title="Before you book"/><Accordion type="single" collapsible>{[
      ["Is the marketing plan really free?","Yes. The consultation and your initial customized plan are free. You can use the recommendations yourself, with your team or ask us about further support."],
      ["Do I need to understand AI or marketing tools?","No. We explain everything in simple language and focus on the business decisions that matter to you."],
      ["What will you review?","We look at your goals, ideal customers, current online presence and biggest marketing challenge. If you have a website or active channels, share them before the call."],
      ["Will AI run my marketing automatically?","AI helps us research, compare patterns and work faster. Human judgment still guides the strategy, message and recommendations."],
      ["What happens after the consultation?","You receive clear next steps. There is no pressure to buy a service, and any ongoing support is discussed separately."],
    ].map(([q,a],i)=><AccordionItem value={`faq-${i}`} key={q}><AccordionTrigger className="faq-trigger">{q}</AccordionTrigger><AccordionContent><p>{a}</p></AccordionContent></AccordionItem>)}</Accordion></section>
  </>;
}

function About({openConsult}:{openConsult:()=>void}) { return <>
  <PageHero eyebrow="Our approach" title="Better tools are useful. A clear strategy is what makes them work." copy="We combine AI-powered research with practical human thinking to help growing businesses make smarter marketing decisions."/>
  <section className="section shell about-grid"><div><h2>We start with your real business problem</h2><p>You may need more qualified leads, stronger search visibility, clearer content or a better way to measure results. We listen first, then use AI to uncover patterns and opportunities that support that goal.</p><p>The result is not a generic report. It is a short, focused plan you can understand and use—whether you take the next steps yourself or ask us to help.</p><div className="inline-actions"><button className="button primary" onClick={openConsult}>Get My Free Marketing Plan</button><a className="button secondary" href="/#process">See How It Works</a></div></div><aside className="info-panel"><span className="panel-icon"><Sparkles/></span><p className="eyebrow">Our promise</p><h3>Simple advice. Clear priorities.</h3><p>No confusing language, inflated promises or one-size-fits-all packages. Just practical direction based on your business.</p></aside></section>
  <section className="section section-tint"><div className="shell two-column"><div><span className="eyebrow">AI + human strategy</span><h2>Faster insight without losing the human side</h2></div><div><p>AI can quickly review patterns, questions, keywords and campaign information. It helps us see more and work faster.</p><p>Human judgment decides what is relevant, what fits your brand and what your customers will trust. That balance keeps the plan useful and realistic.</p></div></div></section>
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
  return <><PageHero eyebrow="Your free customized plan" title="Let’s turn your marketing problem into a clear next step" copy="Share what is not working and what you want to achieve. We’ll review your situation and prepare a simple plan built around your business."/>
    <section className="section shell contact-layout"><div className="form-card"><div className="form-heading"><span className="eyebrow">Start here</span><h2>Book your free consultation</h2><p>You do not need a finished strategy or perfect data. Bring your questions, your goals and the marketing challenge that keeps slowing you down.</p></div><div className="consult-benefits"><p><CheckCircle2/> A focused review of your current marketing</p><p><CheckCircle2/> Clear priorities based on your business goals</p><p><CheckCircle2/> A customized plan you can start using</p></div><button className="button primary submit-button" onClick={openConsult}>Get My Free Marketing Plan</button><p className="timezone-note">Choose a preferred date and time. We’ll follow up to confirm the consultation.</p></div><aside className="contact-aside"><div className="info-panel"><span className="panel-icon"><Sparkles/></span><p className="eyebrow">What to share</p><h2>Your biggest challenge</h2><p>Tell us where you feel stuck: getting found online, creating content, attracting better leads, running ads or knowing what to do next.</p></div><div className="consult-card"><ClipboardList/><h2>No generic checklist</h2><p>Your recommendations will be shaped around your audience, goals, current online presence and available resources.</p></div></aside></section>
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
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="consult-dialog"><DialogHeader><span className="eyebrow">Free customized marketing plan</span><DialogTitle>Tell us where your marketing feels stuck</DialogTitle><DialogDescription>{consultationMessage}</DialogDescription></DialogHeader>{status==="success"?<div className="success-panel"><CheckCircle2/><h3>Your request is received</h3><p>We’ll review what you shared and contact you to confirm the consultation time.</p><button className="button secondary" onClick={()=>setOpen(false)}>Close</button></div>:<form onSubmit={submit}><div className="form-grid"><Field label="Full name *" name="fullName" required/><Field label="Business / organization *" name="organization" required/><Field label="Email *" name="email" type="email" required/><Field label="Phone *" name="phone" type="tel" required/><Field label="Business type *" name="businessType" required/><Field label="Business website" name="businessWebsite" type="url" placeholder="https://"/><label className="field full"><span>What is your biggest marketing challenge or goal? *</span><textarea name="message" required minLength={10} rows={4} placeholder="For example: We post regularly, but we are not getting enough qualified enquiries."/></label><Field label="Preferred date *" name="preferredDate" type="date" required min={new Date().toISOString().slice(0,10)}/><Field label="Preferred time *" name="preferredTime" type="time" required/><label className="field full"><span>Anything else we should know?</span><textarea name="additionalNotes" rows={3}/></label><label className="hp" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="timezone-note">Timezone: Asia/Kathmandu. Your preferred time is confirmed after we follow up.</p><button className="button primary submit-button" disabled={status==="loading"}>{status==="loading"?"Sending request…":"Request My Free Plan"}</button><FormStatus status={status} error={error} id="consult-status" success=""/></form>}</DialogContent></Dialog>;
}

function ProductDialog({product,open,onOpenChange}:{product:Product|null,open:boolean,onOpenChange:(open:boolean)=>void}) { if(!product)return null; const category=categoryBySlug[product.category];return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="product-dialog"><DialogHeader><span className="sample-badge">Illustrative sample</span><DialogTitle>{product.name}</DialogTitle><DialogDescription>{category.shortName}</DialogDescription></DialogHeader><div className="product-detail-media"><Image src={product.image} fill sizes="600px" alt={product.imageAlt}/></div><p>{product.description}</p><dl className="detail-list"><div><dt>Reference ID</dt><dd>{product.id}</dd></div><div><dt>Option type</dt><dd>{product.type}</dd></div><div><dt>Verified brand</dt><dd>Not provided</dd></div><div><dt>Specifications / packaging</dt><dd>Confirm on enquiry</dd></div></dl><p className="sample-note">This record is sample data and does not confirm inventory, price, specification, packaging or availability.</p><a className="button primary" href={`/contact?type=quote&category=${product.category}&product=${product.id}`}>Request a Quote</a></DialogContent></Dialog>; }

function CategoryGrid({detailed=false}:{detailed?:boolean}) { return <div className={`category-grid ${detailed?"detailed":""}`}>{categories.map(c=><article className="category-card" key={c.slug}><span className="category-icon"><Icon name={c.icon}/></span><h3>{c.name}</h3><p>{c.description}</p>{detailed&&<p className="examples"><strong>May include:</strong> {c.examples.join(", ")}.</p>}<a href={`/products/${c.slug}`}>View category <ArrowUpRight size={16}/></a></article>)}</div>; }

function ProductGrid({items,onOpen}:{items:Product[],onOpen?:(p:Product)=>void}) { return <div className="product-grid">{items.map(p=>{const c=categoryBySlug[p.category];return <article className="product-card" key={p.id}><button className="product-visual" onClick={()=>onOpen?.(p)} aria-label={`View details for ${p.name}`} disabled={!onOpen}><span><Icon name={c.icon} size={34}/></span><small>{p.id}</small></button><div className="product-body"><div className="badge-row"><span className="sample-badge">Sample item</span><span className="type-badge">{p.type}</span></div><h3>{p.name}</h3><p>{p.description}</p><div className="card-actions">{onOpen?<button className="text-link" onClick={()=>onOpen(p)}>View details</button>:<a className="text-link" href={`/catalogue?product=${p.id}`}>View details</a>}<a href={`/contact?type=quote&category=${p.category}&product=${p.id}`}>Request a Quote</a></div></div></article>})}</div>; }

function SectionHead({eyebrow,title,copy,action}:{eyebrow:string,title:string,copy?:string,action?:React.ReactNode}) { return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{action}</div>; }
function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}) { return <section className="page-hero"><div className="shell page-hero-inner"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p>{actions&&<div className="hero-actions">{actions}</div>}</div></section>; }
function ConsultationBand({openConsult}:{openConsult:()=>void}) { return <section className="section shell"><div className="consult-band"><div><span className="eyebrow light">Your next step is simple</span><h2>Get a free marketing plan built around your business</h2><p>{consultationMessage}</p></div><div><button className="button light-button" onClick={openConsult}>Get My Free Marketing Plan</button><small>No generic package. No pressure. Just clear direction.</small></div></div></section>; }

function Footer({openConsult}:{openConsult:()=>void}) {return <footer className="site-footer"><div className="shell footer-grid"><div><a className="brand logo-brand footer-brand" href="/" aria-label="Ashutosh Trade home"><Image src="/assets/ashutosh-trade-logo.png" width={652} height={179} alt="Ashutosh Trade"/></a><p>AI-powered digital marketing made clear, practical and useful for growing businesses.</p><button className="button light-button" onClick={openConsult}>Get My Free Marketing Plan</button></div><div><h2>Explore</h2>{mainLinks.map(([h,l])=><a href={h} key={h}>{l}</a>)}</div><div><h2>Services</h2><a href="/#services">Search visibility</a><a href="/#services">Content strategy</a><a href="/#services">Smarter campaigns</a><a href="/#services">Clear reporting</a></div><div><h2>Start here</h2><p>Tell us your biggest marketing challenge and receive a customized plan with clear next steps.</p></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Ashutosh Trade. All rights reserved.</span><span>AI-powered insight. Human-guided strategy.</span></div></footer>}

function Field({label,name,type="text",required,placeholder,min}:{label:string,name:string,type?:string,required?:boolean,placeholder?:string,min?:string}) {return <label className="field"><span>{label}</span><input name={name} type={type} required={required} placeholder={placeholder} min={min}/></label>}
function SelectField({label,value,onChange,options,labels={},className=""}:{label:string,value:string,onChange:(v:string)=>void,options:string[],labels?:Record<string,string>,className?:string}) {return <div className={`field ${className}`}><span>{label}</span><Select value={value} onValueChange={v=>onChange(v??options[0])}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o} value={o}>{labels[o]||o}</SelectItem>)}</SelectContent></Select></div>}
function FormStatus({status,error,id,success}:{status:string,error:string,id:string,success:string}) {if(status!=="success"&&status!=="error")return <p id={id} className="sr-only" aria-live="polite">{status==="loading"?"Submitting form":""}</p>;return <div id={id} className={`form-status ${status}`} role={status==="error"?"alert":"status"}>{status==="success"?<CheckCircle2/>:<AlertCircle/>}<p>{status==="success"?success:error}</p></div>}
