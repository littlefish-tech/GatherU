import ExploreBtn from "@/components/ExploreBtn"
import EventCard from "@/components/EventCard"
import { getEvents, type EventRecord } from "@/lib/actions/event.actions"

const Page = async () => {
  // Read featured events through the cached server helper instead of self-fetching an API route.
  const events = await getEvents()

  return (
    <section>
      <h1 className="text-center">
        GatherU <br /> Campus Events You Shouldn&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, workshops, socials, and community moments, all in one
        place
      </p>

      <ExploreBtn />

      <div id="events" className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: EventRecord) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
