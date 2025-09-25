export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms & Conditions
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-4">
            This page is currently under construction. Please check back later
            for our complete terms and conditions.
          </p>
          <p className="text-gray-600">
            For immediate assistance, please contact us at{" "}
            <a
              href="mailto:info@iicpa.com"
              className="text-blue-600 hover:underline"
            >
              info@iicpa.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
