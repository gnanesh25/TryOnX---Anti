function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-12 text-center">
        <h1 className="font-display font-bold text-4xl text-cream">{title}</h1>
      </div>
      <div className="container max-w-3xl mx-auto px-4 py-12 prose prose-sm">
        {children}
      </div>
    </div>
  )
}

export function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <p>Last updated: October 2026</p>
      <h2>Delivery Timeframes</h2>
      <ul>
        <li>Standard Delivery: 5–7 business days</li>
        <li>Express Delivery: 2–3 business days (where available)</li>
        <li>Metro cities: Usually 3–5 business days</li>
      </ul>
      <h2>Shipping Charges</h2>
      <p>Free shipping on all orders above ₹999. A flat shipping fee of ₹99 applies to orders below ₹999.</p>
      <h2>Tracking</h2>
      <p>You will receive a tracking token upon order confirmation. Use it at <a href="/track-order">/track-order</a> to monitor your delivery.</p>
    </PolicyPage>
  )
}

export function ReturnsPolicyPage() {
  return (
    <PolicyPage title="Returns & Exchanges">
      <p>Last updated: October 2026</p>
      <h2>30-Day Returns</h2>
      <p>We accept returns within 30 days of delivery, provided items are unworn, unwashed, and in original packaging with tags intact.</p>
      <h2>How to Return</h2>
      <ol>
        <li>Contact us at support@tryonx.in with your order number</li>
        <li>We'll arrange a pickup or provide a return address</li>
        <li>Refund processed within 5–7 business days of receiving the item</li>
      </ol>
      <h2>Non-Returnable Items</h2>
      <p>Innerwear, swimwear, and items marked as "Final Sale" cannot be returned for hygiene reasons.</p>
    </PolicyPage>
  )
}

export function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>Last updated: October 2026</p>
      <h2>Data We Collect</h2>
      <p>We collect name, email, phone, and shipping address for order fulfillment. For AI try-on, we temporarily store your uploaded photo.</p>
      <h2>AI Try-On Photos</h2>
      <p>Photos uploaded for virtual try-on are stored in a private, encrypted bucket and automatically deleted within 24 hours. They are never shared with third parties or used for marketing.</p>
      <h2>Payments</h2>
      <p>All payments are processed by Razorpay. TryOnX does not store card numbers or CVVs.</p>
      <h2>Your Rights</h2>
      <p>You may request deletion of your data by emailing privacy@tryonx.in. We will process your request within 7 business days.</p>
    </PolicyPage>
  )
}

export function TermsPage() {
  return (
    <PolicyPage title="Terms of Service">
      <p>Last updated: October 2026</p>
      <h2>Use of Service</h2>
      <p>TryOnX is a retail fashion store. Customers may browse, purchase, and use the AI try-on feature for personal shopping purposes only.</p>
      <h2>Product Catalogue</h2>
      <p>All products are managed exclusively by the TryOnX administrator. Customers may not add, edit, or modify product listings.</p>
      <h2>AI Try-On</h2>
      <p>Virtual try-on results are visual guides only and do not guarantee exact fit, color accuracy, or physical appearance. TryOnX is not liable for purchase decisions based solely on AI-generated previews.</p>
      <h2>Limitation of Liability</h2>
      <p>TryOnX's liability is limited to the value of the order in dispute. We are not responsible for third-party delivery delays.</p>
    </PolicyPage>
  )
}
