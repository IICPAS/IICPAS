import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${API_BASE}/contact-info/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch contact information" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching all contact info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
