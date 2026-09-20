import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityForm } from "@/components/teacher/AvailabilityForm";

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { teacherProfile: { include: { availability: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] } } } } });
  if (user?.role !== "TEACHER") redirect("/dashboard");
  return <AvailabilityForm initialSlots={(user.teacherProfile?.availability ?? []).map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }))} />;
}
