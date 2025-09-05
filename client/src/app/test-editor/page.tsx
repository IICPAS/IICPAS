"use client";
import React, { useState } from "react";
import OptimizedJoditEditor from "../components/OptimizedJoditEditor";

export default function TestEditorPage() {
  const [content, setContent] = useState(
    "<p>Start typing here to test the optimized editor...</p>"
  );
  const [content2, setContent2] = useState("<p>Another editor instance...</p>");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Optimized Jodit Editor Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the smooth typing experience with our optimized Jodit editor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Editor 1 - Rich Content
            </h2>
            <OptimizedJoditEditor
              value={content}
              onChange={setContent}
              placeholder="Type your content here..."
              height={400}
              enableVideo={true}
              className="border border-gray-200 rounded-lg"
            />

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Content Preview:
              </h3>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>

          {/* Second Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Editor 2 - Simple Content
            </h2>
            <OptimizedJoditEditor
              value={content2}
              onChange={setContent2}
              placeholder="Another editor instance..."
              height={300}
              enableVideo={true}
              className="border border-gray-200 rounded-lg"
            />

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Content Preview:
              </h3>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: content2 }}
              />
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🚀 Performance Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">✅ Optimizations Applied:</h4>
              <ul className="space-y-1">
                <li>• Debounced onChange (150ms delay)</li>
                <li>• Disabled performance-heavy features</li>
                <li>• CSS optimizations for smooth typing</li>
                <li>• Efficient event handling</li>
                <li>• Memory leak prevention</li>
                <li>• Video support (YouTube, Vimeo, direct links)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 Features Disabled:</h4>
              <ul className="space-y-1">
                <li>• Auto-height adjustment</li>
                <li>• Character/word counters</li>
                <li>• Search functionality</li>
                <li>• XPath status bar</li>
                <li>• Storage mode</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            🧪 Testing Instructions
          </h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>
              1. <strong>Type continuously</strong> in either editor to test
              smooth typing
            </p>
            <p>
              2. <strong>Use formatting tools</strong> (bold, italic, lists) to
              test toolbar performance
            </p>
            <p>
              3. <strong>Paste content</strong> to test paste handling
            </p>
            <p>
              4. <strong>Switch between editors</strong> to test multiple
              instances
            </p>
            <p>
              5. <strong>Check console</strong> for any performance warnings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
