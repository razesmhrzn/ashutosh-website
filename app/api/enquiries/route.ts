import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { categoryBySlug, productById } from "@/lib/site-data";

export const runtime = "edge";

const clean = (value:unknown, max=500) => typeof value === "string" ? value.trim().slice(0,max) : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request:NextRequest) {
  let body:Record<string,unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({error:"Invalid request data."},{status:400}); }

  if (clean(body.website)) return NextResponse.json({error:"Submission rejected."},{status:400});
  const started = Number(body.formStartedAt);
  if (!Number.isFinite(started) || Date.now()-started < 1200 || Date.now()-started > 43_200_000) return NextResponse.json({error:"Please review the form and submit it again."},{status:400});

  const kind = body.kind === "consultation" ? "consultation" : "enquiry";
  const fullName=clean(body.fullName,120), organization=clean(body.organization,160), email=clean(body.email,200), phone=clean(body.phone,50), message=clean(body.message,3000), clientToken=clean(body.clientToken,100);
  if (!fullName || !organization || !emailPattern.test(email) || !message || !clientToken) return NextResponse.json({error:"Please complete all required fields with valid information."},{status:422});

  const category=clean(body.category,100); const product=clean(body.product,100);
  if (category && category !== "none" && !categoryBySlug[category]) return NextResponse.json({error:"Please select a valid product category."},{status:422});
  if (product && product !== "none" && !productById[product]) return NextResponse.json({error:"Please select a valid product."},{status:422});
  if (kind === "consultation" && (!clean(body.businessType,120) || !clean(body.preferredDate,20) || !clean(body.preferredTime,20))) return NextResponse.json({error:"Please complete the business type, preferred date and preferred time."},{status:422});
  if (!env.DB) return NextResponse.json({error:"The enquiry service is not connected in this environment. Please try again after the site administrator configures storage."},{status:503});

  try {
    await env.DB.prepare(`INSERT INTO enquiries (client_token, kind, full_name, organization, email, phone, enquiry_type, category, product, business_type, business_website, message, preferred_date, preferred_time, timezone, additional_notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(clientToken,kind,fullName,organization,email,phone||null,clean(body.enquiryType,100)||null,category==="none"?null:category||null,product==="none"?null:product||null,clean(body.businessType,120)||null,clean(body.businessWebsite,300)||null,message,clean(body.preferredDate,20)||null,clean(body.preferredTime,20)||null,kind==="consultation"?"Asia/Kathmandu":null,clean(body.additionalNotes,2000)||null,new Date().toISOString()).run();
    return NextResponse.json({accepted:true,kind,status:kind==="consultation"?"request_received":"received"},{status:201});
  } catch (error) {
    const detail=error instanceof Error?error.message:"";
    if (detail.includes("UNIQUE") || detail.includes("unique")) return NextResponse.json({error:"This form has already been submitted."},{status:409});
    console.error("Enquiry storage failed",error);
    return NextResponse.json({error:"We could not store your submission. Your information has not been accepted; please try again."},{status:503});
  }
}
