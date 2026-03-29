import Image from "next/image"

const ExploreBtn = () => {
  return (
    // Use a hash link so the hero CTA scrolls to the featured events section.
    <a href="#events" id="explore-btn" className="mt-7 mx-auto">
      <span>
        <strong>Explore Events</strong>
        <em>
          <Image
            src="/icons/arrow-down.svg"
            alt="arrow-down"
            width={22}
            height={22}
          />
        </em>
      </span>
    </a>
  )
}

export default ExploreBtn
