import { Zap } from 'lucide-react'

const MESSAGES = [
  '✨ Free shipping on orders above ₹999',
  '🎉 New arrivals every week',
  '🔁 Easy 30-day returns',
  '🤖 Try any outfit virtually with AI',
]

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap w-max gap-16">
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span key={i} className="flex items-center gap-2">
            {msg}
            <span className="text-lime/60">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
