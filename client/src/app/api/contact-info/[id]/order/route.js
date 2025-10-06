import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${API_BASE}/contact-info/${id}/order`, {
      method: "PUT",
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
        {
          error:
            errorData.error || "Failed to update contact information order",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error updating contact info order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
