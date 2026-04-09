export function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800 mb-8 font-[Poppins]">Data Deletion Instructions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">How to Delete Your Data</h2>
            <p>
              FasalRakshak respects your right to control your personal data. You can request deletion
              of your account and all associated data through any of the following methods:
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Method 1: Via WhatsApp</h2>
            <div className="bg-primary-50 p-4 rounded-lg">
              <p>Send the message <strong>"DELETE"</strong> or <strong>"डिलीट"</strong> to our WhatsApp number:</p>
              <p className="text-lg font-semibold mt-2">+91 98185 51588</p>
              <p className="text-sm text-gray-500 mt-1">You will receive a confirmation message within 24 hours.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Method 2: Via Email</h2>
            <div className="bg-primary-50 p-4 rounded-lg">
              <p>Send an email to:</p>
              <p className="text-lg font-semibold mt-2">
                <a href="mailto:support@fasalrakshak.in" className="text-primary-600 underline">support@fasalrakshak.in</a>
              </p>
              <p className="text-sm text-gray-500 mt-1">Include your registered phone number or email in the request.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Method 3: Via App</h2>
            <div className="bg-primary-50 p-4 rounded-lg">
              <p>Log in to your FasalRakshak account → Profile → Settings → Delete Account</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">What Gets Deleted</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Name, email, phone number, profile information</li>
              <li><strong>Plant images:</strong> All uploaded photos and diagnosis history</li>
              <li><strong>WhatsApp data:</strong> Conversation history and session data</li>
              <li><strong>Preferences:</strong> Language settings, saved crops, and favorites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Timeline</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Deletion request acknowledgment: <strong>within 24 hours</strong></li>
              <li>Account deactivation: <strong>within 48 hours</strong></li>
              <li>Complete data removal from all systems: <strong>within 30 days</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Data We May Retain</h2>
            <p>
              After deletion, we may retain anonymized, aggregated data that cannot be linked back to you
              for agricultural research and service improvement purposes. We may also retain data required
              by law or for legitimate business purposes (e.g., fraud prevention).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
