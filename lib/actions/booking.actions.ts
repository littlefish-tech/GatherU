"use server"

import { cacheLife, cacheTag, updateTag } from "next/cache"

import connectDB from "@/lib/mongodb"
import { Booking } from "@/database"

type CreateBookingInput = {
  eventId: string
  slug: string
  email: string
}

export async function createBooking({
  eventId,
  slug,
  email,
}: CreateBookingInput) {
  try {
    await connectDB()

    if (!eventId || !email) {
      return { success: false, message: "Event and email are required" }
    }

    await Booking.create({
      eventId,
      email: email.trim().toLowerCase(),
    })

    updateTag("events")
    updateTag(`event:${slug}`)

    return { success: true }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        success: false,
        message: "This email has already booked a spot for the event",
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Booking failed",
    }
  }
}

export async function getBookingCountByEventId(
  eventId: string,
  slug: string
): Promise<number> {
  "use cache"

  // Tag this count with the same event tag so bookings refresh the message on the detail page.
  cacheLife("hours")
  cacheTag("events")
  cacheTag(`event:${slug}`)

  await connectDB()

  return Booking.countDocuments({ eventId })
}
