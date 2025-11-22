import { getPublicPricingPlans } from "@/actions/prices/public";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPublicPricingPlans();

  if (result.success) {
    return NextResponse.json({ success: true, data: result.data || [] });
  }

  return NextResponse.json(
    {
      success: false,
      error: result.error || "Failed to fetch pricing plans",
    },
    { status: 500 }
  );
}
