import Link from "next/link"

export default function NotFound() {
  return (
    <main>
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <h1>Event Not Found</h1>
        <p className="text-light-100 max-w-xl">
          The event you are looking for does not exist or may have been removed.
        </p>
        <Link href="/#events" className="pill">
          Back to events
        </Link>
      </section>
    </main>
  )
}
