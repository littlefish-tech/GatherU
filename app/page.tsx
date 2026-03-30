import ExploreBtn from "@/components/ExploreBtn"
import EventCard from "@/components/EventCard"
import LightRays from "@/components/LightRays"
import { getEvents, type EventRecord } from "@/lib/actions/event.actions"

const Page = async () => {
  // Read featured events through the cached server helper instead of self-fetching an API route.
  const events = await getEvents()

  return (
    <section className="-mt-10 space-y-16">
      <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <div className="relative mx-auto flex min-h-[28rem] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center sm:px-10">
          <h1 className="text-center">
            GatherU <br /> Campus Events You Shouldn&apos;t Miss
          </h1>
          <p className="mt-5 max-w-2xl text-center text-slate-100">
            Hackathons, workshops, socials, and community moments, all in one
            place
          </p>

          <ExploreBtn />
        </div>
      </div>

      <div id="events" className="space-y-7">
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
