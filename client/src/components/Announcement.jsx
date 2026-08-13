const Announcement = () => {

  const announcements = [
    "🔥 Get 20% OFF on your first order",
    "🚚 Free delivery on orders above ₹499",
    "🥬 Fresh groceries delivered to your doorstep",
    "💳 Easy & secure payments on every order",
  ]

  return (
  <div
  className="relative mt-1.5 left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gray-950 text-white"
  style={{
    borderTop: "2px dotted rgba(255,255,255,0.8)",
    borderBottom: "2px dotted rgba(255,255,255,0.8)",
  }}
>
      
      <div className="flex whitespace-nowrap animate-marquee">

        {announcements.map((item, index) => (
          <span
            key={index}
            className="mx-10 py-1.5 text-xs md:text-sm font-medium"
          >
            {item}
          </span>
        ))}

        {announcements.map((item, index) => (
          <span
            key={`duplicate-${index}`}
            className="mx-10 py-1.5 text-xs md:text-sm font-medium"
          >
            {item}
          </span>
        ))}

      </div>

    </div>
  )
}
export default Announcement;