import EventDetails from "@/components/EventDetails"

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  // App Router passes dynamic params as an async value in this Next.js version.
  const { slug } = await params

  return (
    <main>
      <EventDetails slug={slug} />
    </main>
  )
}
export default EventDetailsPage
