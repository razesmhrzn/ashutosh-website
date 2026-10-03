export type ProductType = "Branded option" | "Generic option";

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  uses: string[];
  examples: string[];
  icon: string;
  related: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  type: ProductType;
  brandName: null;
  specifications: null;
  packaging: null;
  image: string;
  imageAlt: string;
  sample: true;
};

export const consultationMessage = "Tell us where your marketing feels stuck. We’ll review your goals, audience and current online presence, then create a free customized digital marketing plan with clear next steps.";

export const categories: Category[] = [
  { slug:"cleaning-laundry-chemicals", name:"CLEANING & LAUNDRY CHEMICALS", shortName:"Cleaning & Laundry Chemicals", icon:"FlaskConical", description:"Everyday chemical categories for cleaning and laundry routines.", intro:"Explore illustrative cleaning and laundry chemical types for routine facility, housekeeping and linen-care requirements.", uses:["Routine floor and surface cleaning","Laundry and linen-care programs","Glass and high-touch area cleaning","Kitchen and utility-area degreasing"], examples:["floor cleaners","laundry detergents","glass cleaners","degreasers"], related:["cleaning-tools-equipment","hand-hygiene-soaps","dispensing-systems"] },
  { slug:"cleaning-tools-equipment", name:"CLEANING TOOLS & EQUIPMENT", shortName:"Cleaning Tools & Equipment", icon:"BrushCleaning", description:"Manual tools and equipment for practical daily housekeeping work.", intro:"Browse illustrative tools and equipment that support cleaning teams across different spaces and routines.", uses:["Floor-care routines","Washroom and common-area upkeep","Housekeeping team organization","Waste and utility tasks"], examples:["mops","brushes","buckets","cleaning trolleys"], related:["cleaning-laundry-chemicals","machinery-spare-parts","papers-disposables"] },
  { slug:"machinery-spare-parts", name:"MACHINERY & SPARE PARTS", shortName:"Machinery & Spare Parts", icon:"Cog", description:"Cleaning machines, compatible accessories and spare-part enquiries.", intro:"Review illustrative machinery types and request information about compatible accessories or spare parts for your requirements.", uses:["Routine floor care","Dry debris and dust collection","Mechanized cleaning tasks","Maintenance and replacement enquiries"], examples:["vacuum cleaners","scrubber machines","compatible accessories","spare parts"], related:["cleaning-tools-equipment","cleaning-laundry-chemicals","papers-disposables"] },
  { slug:"papers-disposables", name:"PAPERS & DISPOSABLES", shortName:"Papers & Disposables", icon:"ScrollText", description:"Paper products and disposable supplies for shared facilities.", intro:"Explore illustrative paper and disposable product types for washrooms, housekeeping and general facility use.", uses:["Washroom replenishment","Hand-drying stations","Waste collection","Housekeeping stock planning"], examples:["tissue paper","toilet rolls","paper towels","waste bags"], related:["dispensing-systems","hand-hygiene-soaps","guest-room-amenities"] },
  { slug:"dispensing-systems", name:"DISPENSING SYSTEMS", shortName:"Dispensing Systems", icon:"PanelTop", description:"Dispensers that organize soap, tissue and paper towel use.", intro:"Browse illustrative dispensing formats and discuss options suited to your washrooms, kitchens and shared spaces.", uses:["Washroom supply organization","Soap access points","Paper towel stations","Guest and staff facilities"], examples:["soap dispensers","tissue dispensers","paper towel dispensers"], related:["hand-hygiene-soaps","papers-disposables","air-care-fresheners"] },
  { slug:"hand-hygiene-soaps", name:"HAND HYGIENE & SOAPS", shortName:"Hand Hygiene & Soaps", icon:"Hand", description:"Handwash, liquid soap and supporting hygiene supplies.", intro:"Review illustrative handwash and soap categories for institutional and commercial washroom requirements.", uses:["Staff washrooms","Guest washrooms","Shared handwashing points","Refill and dispenser planning"], examples:["handwash","liquid soaps","hand hygiene supplies"], related:["dispensing-systems","papers-disposables","cleaning-laundry-chemicals"] },
  { slug:"air-care-fresheners", name:"AIR CARE & FRESHENERS", shortName:"Air Care & Fresheners", icon:"Wind", description:"Air-care formats for guest, washroom and shared spaces.", intro:"Explore illustrative air-care and odor-control product types for a range of facility environments.", uses:["Guest rooms and reception areas","Washrooms","Office common areas","Routine housekeeping programs"], examples:["air fresheners","room fragrances","odor-control products"], related:["guest-room-amenities","dispensing-systems","cleaning-laundry-chemicals"] },
  { slug:"guest-room-amenities", name:"GUEST & ROOM AMENITIES", shortName:"Guest & Room Amenities", icon:"BedDouble", description:"Guest toiletries, amenity kits and practical room accessories.", intro:"Review illustrative guest and room amenity categories for hotels and other hospitality settings.", uses:["Guest room preparation","Hospitality amenity planning","Restocking routines","Room presentation"], examples:["guest toiletries","amenity kits","room accessories"], related:["linens-guest-apparel","air-care-fresheners","papers-disposables"] },
  { slug:"linens-guest-apparel", name:"LINENS & GUEST APPAREL", shortName:"Linens & Guest Apparel", icon:"Shirt", description:"Linen and guest apparel categories for hospitality settings.", intro:"Explore illustrative linen and guest apparel types and discuss material, size and presentation requirements.", uses:["Guest room linen planning","Bathroom linen requirements","Hospitality apparel","Replacement and replenishment"], examples:["towels","bed linens","bathrobes","slippers"], related:["guest-room-amenities","cleaning-laundry-chemicals","air-care-fresheners"] },
  { slug:"pest-control-solutions", name:"PEST CONTROL SOLUTIONS", shortName:"Pest Control Solutions", icon:"ShieldCheck", description:"Monitoring and management supplies for professional facility programs.", intro:"Review illustrative pest-management supply categories. Request product-specific information and instructions before use.", uses:["Routine facility monitoring","Food-service support areas","Storage spaces","Building maintenance programs"], examples:["traps","monitoring products","pest-management supplies"], related:["cleaning-tools-equipment","papers-disposables","cleaning-laundry-chemicals"] },
];

const sampleImage = "/assets/ashutosh-trade-supplies.png";
const make = (id:string,name:string,category:string,description:string,type:ProductType):Product => ({id,name,category,description,type,brandName:null,specifications:null,packaging:null,image:sampleImage,imageAlt:`Illustrative, brand-neutral view representing ${name.toLowerCase()}`,sample:true});

export const products: Product[] = [
  make("CLC-001","Multi-surface floor cleaner","cleaning-laundry-chemicals","Illustrative liquid cleaner category for routine hard-floor care.","Generic option"),
  make("CLC-002","Laundry detergent","cleaning-laundry-chemicals","Illustrative detergent category for institutional linen-care enquiries.","Branded option"),
  make("CLC-003","Glass cleaner","cleaning-laundry-chemicals","Illustrative cleaner category for glass and mirror maintenance.","Generic option"),
  make("CTE-001","Commercial mop set","cleaning-tools-equipment","Illustrative mop, handle and bucket combination for floor-care tasks.","Generic option"),
  make("CTE-002","Housekeeping trolley","cleaning-tools-equipment","Illustrative trolley category for organizing supplies during routine work.","Branded option"),
  make("CTE-003","Utility brush set","cleaning-tools-equipment","Illustrative brush selection for varied facility cleaning needs.","Generic option"),
  make("MSP-001","Dry vacuum cleaner","machinery-spare-parts","Illustrative vacuum cleaner category; specifications are confirmed on enquiry.","Branded option"),
  make("MSP-002","Floor scrubber machine","machinery-spare-parts","Illustrative mechanized floor-care category; model details are not yet verified.","Branded option"),
  make("MSP-003","Compatible machine accessories","machinery-spare-parts","Illustrative accessory and spare-part enquiry category.","Generic option"),
  make("PAD-001","Toilet roll","papers-disposables","Illustrative paper product category for washroom replenishment.","Generic option"),
  make("PAD-002","Folded paper towel","papers-disposables","Illustrative hand-drying paper category for dispenser use.","Branded option"),
  make("PAD-003","Waste collection bags","papers-disposables","Illustrative disposable bag category for general facility use.","Generic option"),
  make("DSS-001","Liquid soap dispenser","dispensing-systems","Illustrative wall-mounted dispensing category; capacity is confirmed on enquiry.","Generic option"),
  make("DSS-002","Paper towel dispenser","dispensing-systems","Illustrative paper towel dispensing category for shared facilities.","Branded option"),
  make("HHS-001","Liquid handwash","hand-hygiene-soaps","Illustrative handwash category for washroom and handwashing stations.","Generic option"),
  make("HHS-002","Refill soap supply","hand-hygiene-soaps","Illustrative soap refill category; packaging is confirmed on enquiry.","Branded option"),
  make("ACF-001","Room air freshener","air-care-fresheners","Illustrative room fragrance category for routine housekeeping use.","Generic option"),
  make("ACF-002","Odor-control product","air-care-fresheners","Illustrative odor-management supply category.","Branded option"),
  make("GRA-001","Guest amenity kit","guest-room-amenities","Illustrative grouping of guest toiletries and room essentials.","Generic option"),
  make("GRA-002","Room accessory set","guest-room-amenities","Illustrative room-accessory category for hospitality enquiries.","Branded option"),
  make("LGA-001","Guest towel range","linens-guest-apparel","Illustrative towel category; materials and dimensions are confirmed on enquiry.","Generic option"),
  make("LGA-002","Bed linen range","linens-guest-apparel","Illustrative bed-linen category for hospitality requirements.","Branded option"),
  make("PCS-001","Facility monitoring traps","pest-control-solutions","Illustrative monitoring product category; usage details require product guidance.","Generic option"),
  make("PCS-002","Pest-management supplies","pest-control-solutions","Illustrative supply category for professional facility programs.","Branded option"),
];

export const categoryBySlug = Object.fromEntries(categories.map(category => [category.slug, category]));
categoryBySlug["cleaning-tools-equipments"] = categoryBySlug["cleaning-tools-equipment"];
categoryBySlug["linens-guest-apparels"] = categoryBySlug["linens-guest-apparel"];
export const productById = Object.fromEntries(products.map(product => [product.id, product]));

export const mainRoutes = ["/", "/about-us", "/about", "/products", "/catalogue", "/contact"];

export function routeMeta(pathname:string) {
  if (pathname === "/") return { title:"Ashutosh Trade | Housekeeping & Facility Supplies in Nepal", description:"Explore housekeeping supplies, facility products, cleaning machinery and related product categories from Ashutosh Trade in Kathmandu, Nepal." };
  if (pathname === "/about-us" || pathname === "/about") return { title:"About Ashutosh Trade | Facility Supplies in Nepal", description:"Learn how Ashutosh Trade helps organizations compare branded and generic housekeeping, facility and cleaning-supply options." };
  if (pathname === "/products") return { title:"Product Categories | Ashutosh Trade", description:"Explore ten housekeeping, facility, hygiene, machinery and hospitality supply categories." };
  if (pathname === "/catalogue") return { title:"Searchable Product Catalogue | Ashutosh Trade", description:"Search illustrative product categories and request verified product information or a tailored quotation." };
  if (pathname === "/contact") return { title:"Contact Ashutosh Trade | Product Enquiries", description:"Contact Ashutosh Trade in Kathmandu, Nepal about housekeeping supplies, facility products, cleaning machinery or a tailored quotation." };
  const category = categoryBySlug[pathname.replace("/products/","")];
  if (category) return { title:`${category.shortName} | Ashutosh Trade`, description:`Explore illustrative ${category.shortName.toLowerCase()} and request suitable branded or generic options in Kathmandu, Nepal.` };
  return { title:"Page Not Found | Ashutosh Trade", description:"The requested page could not be found." };
}
