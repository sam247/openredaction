'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  columns?: number;
}

export default function FAQAccordion({ items, columns = 1 }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (columns === 2) {
    const midPoint = Math.ceil(items.length / 2);
    const leftColumn = items.slice(0, midPoint);
    const rightColumn = items.slice(midPoint);

    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {leftColumn.map((item, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-xl font-semibold pr-4">{item.question}</h3>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-400">
                  {typeof item.answer === 'string' ? (
                    <p>{item.answer}</p>
                  ) : (
                    item.answer
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {rightColumn.map((item, index) => {
            const actualIndex = midPoint + index;
            return (
              <div
                key={actualIndex}
                className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
              >
                <button
                  onClick={() => toggle(actualIndex)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-xl font-semibold pr-4">{item.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${
                      openIndex === actualIndex ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === actualIndex && (
                  <div className="px-6 pb-4 text-gray-400">
                    {typeof item.answer === 'string' ? (
                      <p>{item.answer}</p>
                    ) : (
                      item.answer
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-xl font-semibold pr-4">{item.question}</h3>
            <ChevronDown
              size={20}
              className={`text-gray-400 flex-shrink-0 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 text-gray-400">
              {typeof item.answer === 'string' ? (
                <p>{item.answer}</p>
              ) : (
                item.answer
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

