export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-20 text-center">
        <h1 className="font-display font-bold text-5xl text-cream mb-4">About TryOnX</h1>
        <p className="text-cream/60 max-w-xl mx-auto">India's first AI-powered fashion store where you see it on <em>you</em> before buying.</p>
      </div>
      <div className="container max-w-3xl mx-auto px-4 py-16 prose prose-lg">
        <h2>Our Story</h2>
        <p>TryOnX was founded with a simple vision: make online fashion shopping as confident as shopping in a physical store. With AI virtual try-on, we eliminate the guesswork.</p>
        <h2>What Makes Us Different</h2>
        <ul>
          <li>Every product can be virtually tried on before purchase</li>
          <li>Curated, high-quality fashion across all categories</li>
          <li>Transparent pricing — no hidden costs</li>
          <li>30-day easy returns</li>
          <li>Powered by India's most trusted payment gateway</li>
        </ul>
        <h2>Our Mission</h2>
        <p>To make fashion accessible, confident, and joyful for every Indian customer — with technology that respects your privacy and puts style in your hands.</p>
      </div>
    </div>
  )
}
