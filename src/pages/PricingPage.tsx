// Viewebit-web/src/pages/PricingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PricingTier {
  name: string;
  tagline: string;
  highlighted?: boolean;
  features: { label: string; included: boolean }[];
}

const TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tagline: 'Small coaching institutes and single-course educators',
    features: [
      { label: 'Course & lesson authoring', included: true },
      { label: 'Test series & quiz categories', included: true },
      { label: 'Assignments & grading', included: true },
      { label: 'Certificates', included: true },
      { label: 'Multi-branch management', included: false },
      { label: 'Custom reporting exports', included: false },
    ],
  },
  {
    name: 'Growth',
    tagline: 'Growing institutes with multiple educators and branches',
    highlighted: true,
    features: [
      { label: 'Everything in Starter', included: true },
      { label: 'Multi-branch & department management', included: true },
      { label: 'Role-based admin access', included: true },
      { label: 'Revenue & enrollment reporting', included: true },
      { label: 'Priority support', included: true },
      { label: 'Dedicated onboarding', included: false },
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Schools, colleges, and multi-institution organizations',
    features: [
      { label: 'Everything in Growth', included: true },
      { label: 'Dedicated onboarding', included: true },
      { label: 'Custom institutional agreements', included: true },
      { label: 'Priority feature requests', included: true },
      { label: 'SLA-backed support', included: true },
      { label: 'Volume-based pricing', included: true },
    ],
  },
];

const FAQS = [
  {
    question: 'How is Viewebit LMS priced?',
    answer: 'Pricing is tailored per institution based on student volume and the features you need — we don’t publish flat per-seat rates because institutions vary widely in size and requirements.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Book a demo and we’ll walk through a trial setup tailored to your institution before any commitment.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes — as your institution grows, your plan can be adjusted without disrupting existing courses or student data.',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Institution-First Pricing
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Every institution is different — talk to us and we'll build a plan that fits yours.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 ${tier.highlighted ? 'border-2 border-primary-500 shadow-xl relative' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-6 min-h-[3rem]">{tier.tagline}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature.label} className="flex items-start">
                      {feature.included ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`btn w-full justify-center ${tier.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  Request a Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="page-container max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Pricing Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
