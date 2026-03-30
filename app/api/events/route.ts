import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { put } from "@vercel/blob"
import { writeFile } from "fs/promises"
import path from "path"

import connectDB from "@/lib/mongodb"
import Event from "@/database/event.model"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const formData = await req.formData()

    let event

    try {
      event = Object.fromEntries(formData.entries())
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      )
    }

    const imageFile = formData.get("imageFile")

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      )
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Uploaded file must be an image" },
        { status: 400 }
      )
    }

    const tags = JSON.parse(formData.get("tags") as string)
    const agenda = JSON.parse(formData.get("agenda") as string)
    const extension = path.extname(imageFile.name) || ".png"
    const safeBaseName = (String(event.title || "event")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "event")
    const fileName = `${safeBaseName}-${Date.now()}${extension}`
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    let image: string

    if (blobToken) {
      // Use Blob in environments that provide a persistent upload target, like Vercel.
      const blob = await put(`events/${fileName}`, imageFile, {
        access: "public",
        addRandomSuffix: false,
        token: blobToken,
      })

      image = blob.url
    } else {
      // Keep local development working without Blob by falling back to the repo filesystem.
      const filePath = path.join(process.cwd(), "public", "images", fileName)
      await writeFile(filePath, buffer)
      image = `/images/${fileName}`
    }

    const createdEvent = await Event.create({
      ...event,
      image,
      tags,
      agenda,
    })

    revalidateTag("events", "max")
    revalidateTag(`event:${createdEvent.slug}`, "max")

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    const events = await Event.find().sort({ createdAt: -1 })

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    )
  }
}
