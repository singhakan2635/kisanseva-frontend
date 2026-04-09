export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800 mb-8 font-[Poppins]">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using FasalRakshak's web application, mobile app, or WhatsApp bot services,
              you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">2. Description of Service</h2>
            <p>FasalRakshak provides:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>AI-powered plant disease detection and diagnosis from uploaded images</li>
              <li>Treatment recommendations (mechanical, physical, chemical, biological)</li>
              <li>Mandi/market price information via government data sources</li>
              <li>Government scheme information for farmers</li>
              <li>Multi-language support for Indian languages</li>
              <li>WhatsApp-based advisory bot</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One person may not maintain more than one account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">4. AI Diagnosis Disclaimer</h2>
            <p className="font-semibold text-red-700 bg-red-50 p-4 rounded-lg">
              IMPORTANT: FasalRakshak's plant disease diagnosis is AI-assisted and provided for informational
              purposes only. It is NOT a substitute for professional agricultural advice. Always consult a
              local agricultural expert, Krishi Vigyan Kendra (KVK), or certified agronomist before applying
              any treatment to your crops. We are not responsible for crop losses resulting from reliance
              on AI-generated diagnoses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Upload images unrelated to plant/crop diagnosis</li>
              <li>Attempt to reverse-engineer or exploit our AI systems</li>
              <li>Use the service for any unlawful purpose</li>
              <li>Spam or abuse the WhatsApp bot</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">6. Intellectual Property</h2>
            <p>
              All content, designs, and AI models on FasalRakshak are our intellectual property.
              Disease and pesticide data is sourced from ICAR, CIB India, and other public sources.
              Government scheme information is sourced from official government portals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">7. Limitation of Liability</h2>
            <p>
              FasalRakshak is provided "as is" without warranties of any kind. We shall not be liable for
              any indirect, incidental, or consequential damages arising from your use of the service,
              including but not limited to crop losses, incorrect diagnoses, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">8. Data Deletion</h2>
            <p>
              You may request deletion of your account and all associated data at any time by contacting
              us at <a href="mailto:support@fasalrakshak.in" className="text-primary-600 underline">support@fasalrakshak.in</a> or
              by sending "DELETE" to our WhatsApp number. Account deletion is processed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">9. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">10. Contact</h2>
            <p>
              For questions about these terms, contact us at:<br />
              Email: <a href="mailto:support@fasalrakshak.in" className="text-primary-600 underline">support@fasalrakshak.in</a><br />
              WhatsApp: +91 98185 51588
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
