import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { categoryBySlug, productById } from "@/lib/site-data";

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }

  if (clean(body.website)) {
    return NextResponse.json(
      { error: "Submission rejected." },
      { status: 400 }
    );
  }

  const started = Number(body.formStartedAt);

  if (
    !Number.isFinite(started) ||
    Date.now() - started < 1200 ||
    Date.now() - started > 43_200_000
  ) {
    return NextResponse.json(
      { error: "Please review the form and submit it again." },
      { status: 400 }
    );
  }

  const kind = body.kind === "consultation" ? "consultation" : "enquiry";

  const fullName = clean(body.fullName, 120);
  const organization = clean(body.organization, 160);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 50);
  const message = clean(body.message, 3000);
  const clientToken = clean(body.clientToken, 100);

  if (
    !fullName ||
    !organization ||
    !emailPattern.test(email) ||
    !message ||
    !clientToken
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields with valid information." },
      { status: 422 }
    );
  }

  const category = clean(body.category, 100);
  const product = clean(body.product, 100);

  if (category && category !== "none" && !categoryBySlug[category]) {
    return NextResponse.json(
      { error: "Please select a valid product category." },
      { status: 422 }
    );
  }

  if (product && product !== "none" && !productById[product]) {
    return NextResponse.json(
      { error: "Please select a valid product." },
      { status: 422 }
    );
  }

  if (
    kind === "consultation" &&
    (!clean(body.businessType, 120) ||
      !clean(body.preferredDate, 20) ||
      !clean(body.preferredTime, 20) ||
      !clean(body.productCategories, 1000) ||
      clean(body.consent, 10) !== "true")
  ) {
    return NextResponse.json(
      {
        error:
          "Please complete the business type, product interests, preferred date and time, and consent field.",
      },
      { status: 422 }
    );
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      {
        error:
          "The enquiry service is not connected in this environment. Please try again after the site administrator configures storage.",
      },
      { status: 503 }
    );
  }

  const sql = neon(databaseUrl);

  try {
    const requestNotes = [
      clean(body.additionalNotes, 2000),
      clean(body.productCategories, 1000)
        ? `Product interests: ${clean(body.productCategories, 1000)}`
        : "",
      clean(body.preferredContact, 80)
        ? `Preferred contact: ${clean(body.preferredContact, 80)}`
        : "",
      kind === "consultation" ? "Consent to contact: confirmed" : "",
    ]
      .filter(Boolean)
      .join("\n");

    await sql.query(
      `INSERT INTO enquiries (
        client_token,
        kind,
        full_name,
        organization,
        email,
        phone,
        enquiry_type,
        category,
        product,
        business_type,
        business_website,
        message,
        preferred_date,
        preferred_time,
        timezone,
        additional_notes,
        created_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17
      )`,
      [
        clientToken,
        kind,
        fullName,
        organization,
        email,
        phone || null,
        clean(body.enquiryType, 100) || null,
        category === "none" ? null : category || null,
        product === "none" ? null : product || null,
        clean(body.businessType, 120) || null,
        clean(body.businessWebsite, 300) || null,
        message,
        clean(body.preferredDate, 20) || null,
        clean(body.preferredTime, 20) || null,
        kind === "consultation" ? "Asia/Kathmandu" : null,
        requestNotes || null,
        new Date().toISOString(),
      ]
    );

    return NextResponse.json(
      {
        accepted: true,
        kind,
        status: kind === "consultation" ? "request_received" : "received",
      },
      { status: 201 }
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code ?? "")
        : "";

    if (
      errorCode === "23505" ||
      detail.toLowerCase().includes("unique") ||
      detail.toLowerCase().includes("duplicate")
    ) {
      return NextResponse.json(
        { error: "This form has already been submitted." },
        { status: 409 }
      );
    }

    console.error("Enquiry storage failed", error);

    return NextResponse.json(
      {
        error:
          "We could not store your submission. Your information has not been accepted; please try again.",
      },
      { status: 503 }
    );
  }
}
