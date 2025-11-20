import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assessmentId: string }> }
) {
  try {
    await requireAdmin();
    
    const { assessmentId } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.assessmentSubmission.findMany({
        where: {
          assessmentId: assessmentId,
        },
        select: {
          id: true,
          knowledgeScore: true,
          knowledgeTotal: true,
          knowledgePercentage: true,
          completed: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.assessmentSubmission.count({
        where: {
          assessmentId: assessmentId,
        },
      }),
    ]);

    return NextResponse.json({
      submissions,
      total,
      hasMore: skip + submissions.length < total,
    });
  } catch (error) {
    console.error("Error fetching assessment submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}