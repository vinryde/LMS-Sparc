"use server";
import { prisma } from "@/lib/db";

export async function checkAndUpdateExpiredEnrollments() {
  try {
    const now = new Date();
    
    
    const enrollmentsToExpire = await prisma.enrollment.findMany({
      where: {
        expiresAt: {
          lte: now, 
        },
        isExpired: false,
        expirationDisabled: false, 
        status: {
          not: "Expired",
        },
      },
    });

    
    if (enrollmentsToExpire.length > 0) {
      await prisma.enrollment.updateMany({
        where: {
          id: {
            in: enrollmentsToExpire.map((e) => e.id),
          },
        },
        data: {
          isExpired: true,
          status: "Expired",
        },
      });
    }

    return enrollmentsToExpire.length;
  } catch (error) {
    console.error("Error checking expired enrollments:", error);
    return 0;
  }
}

export async function isEnrollmentExpired(userId: string, courseId: string): Promise<boolean> {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: {
        isExpired: true,
        status: true,
        expiresAt: true,
        expirationDisabled: true,
      },
    });

    if (!enrollment) {
      return false;
    }

    // If expiration is disabled by admin, return false
    if (enrollment.expirationDisabled) {
      return false;
    }

    // Check if already marked as expired
    if (enrollment.isExpired || enrollment.status === "Expired") {
      return true;
    }

    // Check if expiration date has passed
    if (enrollment.expiresAt && new Date() > enrollment.expiresAt) {
      // Update the enrollment
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          isExpired: true,
          status: "Expired",
        },
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking enrollment expiration:", error);
    return false;
  }
}