import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  { question: "What are your opening hours?", answer: "We are open daily from 8:00 AM to 10:00 PM." },
  { question: "Do you offer vegan options?", answer: "Yes! We have almond milk, oat milk, and several vegan snacks." },
  { question: "Is there Wi-Fi available?", answer: "Absolutely. We offer high-speed Wi-Fi for all our customers." },
  { question: "Do you take reservations?", answer: "Yes, you can book a table via our website or call us directly." },
  { question: "Where do you source your beans?", answer: "We source our beans directly from sustainable farms in Coorg and Ethiopia." },
  { question: "Can I host an event here?", answer: "Yes, we have a private area for events. Contact us for details." },
];

const FAQ = ({ isPreview = false }) => {
  const displayedFAQs = isPreview ? faqData.slice(0, 3) : faqData;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-6 py-20 bg-rabuste-bg">
      <div className="max-w-3xl mx-auto">
        {/* FIX: text-white -> text-rabuste-text */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-rabuste-text">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {displayedFAQs.map((faq, index) => (
            // FIX: bg-white/5 -> bg-rabuste-surface, border-white/10 -> border-rabuste-text/10
            <div 
              key={index} 
              className="border border-rabuste-text/10 rounded-sm bg-rabuste-surface overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-rabuste-text/5 transition-colors"
              >
                <span className="text-lg font-semibold text-rabuste-text">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="text-rabuste-gold" /> : <ChevronDown className="text-rabuste-muted" />}
              </button>
              
              {openIndex === index && (
                <div className="p-6 pt-0 text-rabuste-muted leading-relaxed border-t border-rabuste-text/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {isPreview && (
          <div className="flex justify-center mt-10">
            <Link 
              to="/faqs" 
              className="px-8 py-3 border border-rabuste-text/20 text-rabuste-text font-bold tracking-widest uppercase rounded-sm hover:border-rabuste-orange hover:text-rabuste-orange transition-colors"
            >
              View All FAQs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;