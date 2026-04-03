export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800 mb-8 font-[Poppins]">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">1. Introduction</h2>
            <p>
              KisanSeva ("we", "our", "us") is an agriculture technology platform that helps farmers
              identify plant diseases, get treatment recommendations, and access government schemes.
              This Privacy Policy explains how we collect, use, and protect your information when you
              use our web application, mobile app, and WhatsApp bot services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, and role (farmer/expert) when you register.</li>
              <li><strong>Plant Images:</strong> Photos you upload for disease diagnosis. These are processed by our AI systems and are not shared with third parties.</li>
              <li><strong>WhatsApp Messages:</strong> Messages, images, and voice notes you send to our WhatsApp bot for diagnosis and advisory.</li>
              <li><strong>Location Data:</strong> State and region information you provide for localized crop advisory and market prices.</li>
              <li><strong>Usage Data:</strong> App usage patterns, features accessed, and interaction logs for improving our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide plant disease diagnosis and treatment recommendations</li>
              <li>Deliver mandi prices and government scheme information relevant to your region</li>
              <li>Improve our AI models for more accurate disease detection</li>
              <li>Send notifications about crop advisories and weather alerts</li>
              <li>Provide customer support via WhatsApp and in-app channels</li>
              <li>Translate content into your preferred Indian language</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share anonymized, aggregated data for agricultural
              research purposes. We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Meta (WhatsApp Cloud API):</strong> For WhatsApp bot communication</li>
              <li><strong>Sarvam AI:</strong> For Indian language translation and voice services</li>
              <li><strong>Firebase:</strong> For authentication services</li>
              <li><strong>MongoDB Atlas:</strong> For secure data storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (HTTPS/TLS),
              encrypted storage, JWT-based authentication, and rate limiting to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">6. Data Retention</h2>
            <p>
              Account data is retained as long as your account is active. Plant images submitted for
              diagnosis are processed and may be retained for up to 90 days for quality improvement.
              WhatsApp session data is automatically deleted after 24 hours of inactivity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">8. Contact Us</h2>
            <p>
              For any privacy-related queries, contact us at:<br />
              Email: <a href="mailto:privacy@kisanseva.com" className="text-primary-600 underline">privacy@kisanseva.com</a><br />
              WhatsApp: +91 98185 51588
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
