import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
  avatar,
}: TestimonialCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-full flex flex-col">
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}
          />
        ))}
      </div>
      <p className="text-gray-300 mb-6 flex-grow">&quot;{content}&quot;</p>
      <div className="flex items-center">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full mr-4 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400 font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-400">
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  );
}

