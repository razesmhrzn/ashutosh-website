import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const recipientEndpoint = "https://formsubmit.co/ajax/aashutoshtrade@gmail.com";

const cleanPayload = (input: unknown) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;

  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>).map(([key, value]) => [
      key.slice(0, 100),
      String(value ?? "").slice(0, 5000),
    ])
  );
};

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid enquiry data." }, { status: 400 });
  }

  const payload = cleanPayload(body);
  if (!payload || payload._honey) {
    return NextResponse.json({ message: "Submission rejected." }, { status: 400 });
  }

  try {
    const response = await fetch(recipientEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload, _captcha: "false" }),
      signal: AbortSignal.timeout(15_000),
    });

    const result = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || result.success === false) {
      return NextResponse.json(
        { message: result.message || "The enquiry service could not accept your message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("FormSubmit forwarding failed", error);
    return NextResponse.json(
      { message: "The enquiry service is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }
}
