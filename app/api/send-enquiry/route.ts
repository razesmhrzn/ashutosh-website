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
    let serviceMessage = "The email service is temporarily unavailable. Please try again shortly.";

    for (const delay of [0, 1_500, 3_000]) {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));

      const response = await fetch(recipientEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, _captcha: "false" }),
        signal: AbortSignal.timeout(10_000),
      });

      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        detail?: string;
      };

      if (response.ok && result.success !== false) {
        return NextResponse.json({ success: true }, { status: 200 });
      }

      serviceMessage = result.message || result.detail || serviceMessage;
      if (response.status < 500) break;
    }

    return NextResponse.json({ message: serviceMessage }, { status: 502 });
  } catch (error) {
    console.error("FormSubmit forwarding failed", error);
    return NextResponse.json(
      { message: "The enquiry service is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }
}
