'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SlotStatus } from "@prisma/client";

function formatTime(time: string): string {
    // input: "14:00" or "09:00" from HTML time input
    // output: "02:00 PM" or "09:00 AM" matching DB seed format
    if (!time) return "";
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    const hourFormatted = hour < 10 ? '0' + hour : hour;
    return `${hourFormatted}:${minute} ${ampm}`;
}


export async function createBooking(prevState: unknown, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const date = formData.get("date") as string;
    const rawTime = formData.get("time") as string;
    const members = parseInt(formData.get("members") as string) || 1;
    const cost = parseInt(formData.get("cost") as string) || 0;

    if (!name || !email || !date || !rawTime) {
        return { message: "Please fill in all required fields." };
    }

    // Format time to match database (e.g. "10:00 AM")
    const time = formatTime(rawTime);

    try {
        // 1. Check if the slot is already booked
        const existingSlot = await prisma.slot.findFirst({
            where: {
                date,
                time,
                status: SlotStatus.Booked
            }
        });

        if (existingSlot) {
            return { message: `Slot is already booked for ${date} at ${time}.` };
        }

        // 2. Find or Create Customer
        const customer = await prisma.customer.upsert({
            where: { email },
            update: {
                name,
                phone,
            },
            create: {
                name,
                email,
                phone,
                paymentTotal: 0, // Will settle this in the update below to avoid double counting if upsert logic runs differently
                paymentDue: 0,
            }
        });

        // 3. Find and Update existing Open Slot
        const openSlot = await prisma.slot.findFirst({
            where: {
                date,
                time,
                status: SlotStatus.Open
            }
        });

        if (!openSlot) {
            return { message: `No open slot found for ${date} at ${time}. Please create a slot first.` };
        }

        await prisma.slot.update({
            where: { id: openSlot.id },
            data: {
                status: SlotStatus.Booked,
                customerId: customer.id,
                members,
                cost
            }
        });

        // 4. Update customer payments
        if (customer) {
            await prisma.customer.update({
                where: { id: customer.id },
                data: {
                    paymentTotal: { increment: cost },
                    paymentDue: { increment: cost }
                }
            });
        }

    } catch (error: unknown) {
        console.error("Failed to create booking:", error);
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { message: `Error: ${errorMessage}` };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
