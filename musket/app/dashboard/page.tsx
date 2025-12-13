import { prisma } from "@/lib/prisma";
import DashboardClient, { DashboardSlot, DashboardUser } from "./DashboardClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function DashboardPage() {
    // Fetch Slots with relation to Customer
    const slotsData = await prisma.slot.findMany({
        include: {
            bookedBy: true,
        },
        orderBy: {
            date: 'asc', // or time
        }
    });

    // Fetch Customers
    const customersData = await prisma.customer.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    // Transform to Dashboard Interface
    const slots: DashboardSlot[] = slotsData.map((slot) => ({
        id: slot.id,
        time: slot.time,
        date: slot.date,
        status: slot.status,
        bookedByName: slot.bookedBy?.name || null,
    }));

    const users: DashboardUser[] = customersData.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        payment: {
            total: customer.paymentTotal,
            advance: customer.paymentAdvance,
            due: customer.paymentDue,
        },
    }));

    return <DashboardClient slots={slots} users={users} />;
}
