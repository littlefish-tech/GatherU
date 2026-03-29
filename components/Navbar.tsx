import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  // Keep primary navigation declarative so adding pages later only requires updating this list.
  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/events/create", label: "Create Event" },
  ]

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/network-logo.png"
            alt="logo"
            width={24}
            height={24}
          />
          <p>Campus Events</p>
        </Link>
        <ul>
          {links.map((link) => (
            <li key={link.label} className="list-none">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
