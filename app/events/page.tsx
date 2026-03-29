import EventCard from "@/components/EventCard"
import { getEvents, type EventRecord } from "@/lib/actions/event.actions"

export default async function EventsPage() {
  // Reuse the same cached event read used by the homepage.
  const events = await getEvents()

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-slate-900">All Events</h1>
        <p className="max-w-2xl text-slate-700">
          Browse upcoming meetups, hackathons, workshops, and community events.
        </p>
      </div>

      {events.length > 0 ? (
        <ul className="events">
          {events.map((event: EventRecord) => (
            <li key={event.slug} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-700">No events yet. Create the first one.</p>
      )}
    </section>
  )
}
