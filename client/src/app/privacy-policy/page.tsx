"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Subsection {
  title?: string;
  content?: string;
  listItems?: string[];
}

interface Section {
  title: string;
  content: string;
  subsections?: Subsection[];
  listItems?: string[];
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface PrivacyPolicyData {
  title: string;
  lastUpdated: string;
  sections: Section[];
  contactInfo: ContactInfo;
}

export default function PrivacyPolicy() {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const response = await fetch(`${API_BASE}/privacy-policy`);
        const data = await response.json();
        
        if (data.success) {
          setPrivacyPolicy(data.data);
        } else {
          setError('Failed to load privacy policy');
        }
      } catch (err) {
        setError('Error loading privacy policy');
        console.error('Error fetching privacy policy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-10 bg-gray-50 py-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Privacy Policy...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !privacyPolicy) {
    return (
      <>
        <Header />
        <div className="pt-10 bg-gray-50 py-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error || 'Privacy policy not found'}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-10 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              {privacyPolicy.title}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Last updated: {privacyPolicy.lastUpdated}
            </p>

            <div className="prose prose-lg max-w-none">
              {privacyPolicy.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {index + 1}. {section.title}
                  </h2>
                  
                  {section.content && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {section.content}
                    </p>
                  )}

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex}>
                          {subsection.title && (
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {subsection.title}
                            </h3>
                          )}
                          
                          {subsection.content && (
                            <p className="text-gray-600 leading-relaxed mb-2">
                              {subsection.content}
                            </p>
                          )}
                          
                          {subsection.listItems && subsection.listItems.length > 0 && (
                            <ul className="list-disc pl-6 space-y-2">
                              {subsection.listItems.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.listItems && section.listItems.length > 0 && (
                    <ul className="list-disc pl-6 space-y-2">
                      {section.listItems.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.title === "Contact Us" && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <p>
                        <strong>Email:</strong> {privacyPolicy.contactInfo.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {privacyPolicy.contactInfo.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {privacyPolicy.contactInfo.address}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
