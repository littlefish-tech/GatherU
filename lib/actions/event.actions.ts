import { cacheLife, cacheTag } from "next/cache"
import { Types } from "mongoose"

import connectDB from "@/lib/mongodb"
import { Event } from "@/database"

type EventDocumentShape = {
  _id: Types.ObjectId
  title: string
  slug: string
  description: string
  overview: string
  image: string
  imageAuthor?: string
  imageSource?: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type EventRecord = {
  _id: string
  title: string
  slug: string
  description: string
  overview: string
  image: string
  imageAuthor?: string
  imageSource?: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

function toEventRecord(event: EventDocumentShape): EventRecord {
  return {
    _id: String(event._id),
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.overview,
    image: event.image,
    imageAuthor: event.imageAuthor,
    imageSource: event.imageSource,
    venue: event.venue,
    location: event.location,
    date: event.date,
    time: event.time,
    mode: event.mode,
    audience: event.audience,
    agenda: [...event.agenda],
    organizer: event.organizer,
    tags: [...event.tags],
    createdAt: event.createdAt?.toISOString(),
    updatedAt: event.updatedAt?.toISOString(),
  }
}

function toPlainEventRecord(event: EventDocumentShape): EventRecord {
  // Cache Components require plain serializable values, not Mongoose-shaped objects.
  return JSON.parse(JSON.stringify(toEventRecord(event))) as EventRecord
}

export async function getEvents(): Promise<EventRecord[]> {
  "use cache"

  cacheLife("hours")
  cacheTag("events")

  await connectDB()

  const events = await Event.find().sort({ createdAt: -1 }).lean<EventDocumentShape[]>()

  return events.map(toPlainEventRecord)
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
  "use cache"

  cacheLife("hours")
  cacheTag("events")
  cacheTag(`event:${slug}`)

  await connectDB()

  const event = await Event.findOne({ slug }).lean<EventDocumentShape | null>()

  return event ? toPlainEventRecord(event) : null
}
