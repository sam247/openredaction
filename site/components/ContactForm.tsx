'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  useCase: string;
  interest: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    useCase: '',
    interest: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Track form submission
    analytics.formSubmit('contact', {
      hasCompany: !!formData.company.trim(),
      hasUseCase: !!formData.useCase.trim(),
      interestType: formData.interest,
    });

    try {
      // Submit to our API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          useCase: formData.useCase,
          interest: formData.interest,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSubmitted(true);
      setSubmitting(false);
      analytics.formSubmitSuccess('contact');

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          useCase: '',
          interest: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      setSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      analytics.formSubmitError('contact', errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="bg-green-900/20 border border-green-800 rounded-lg p-8 text-center">
        <Check className="mx-auto mb-4 text-green-400" size={48} />
        <h3 className="text-2xl font-semibold mb-2">Thank you!</h3>
        <p className="text-gray-300">
          We&apos;ve received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
            placeholder="Acme Inc."
          />
        </div>

        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-2">
            Use Case / Industry
          </label>
          <input
            type="text"
            id="useCase"
            name="useCase"
            value={formData.useCase}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
            placeholder="Healthcare, Legal, Finance, etc."
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-2">
          Interested In *
        </label>
        <select
          id="interest"
          name="interest"
          required
          value={formData.interest}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gray-700"
        >
          <option value="">Select an option...</option>
          <option value="self-hosted">Self-Hosted Deployment Support</option>
          <option value="github-issue">GitHub Issue / Bug Report</option>
          <option value="contribution">Contribution / Pull Request</option>
          <option value="disclosurely">Disclosurely.com Platform</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 resize-none"
          placeholder="Tell us about your needs..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center space-x-2"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}

