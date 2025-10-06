import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${API_BASE}/contact-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to create contact information" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error creating contact info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
