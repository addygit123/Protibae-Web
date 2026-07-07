import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    author: 'Alex M.',
    rating: 5,
    date: 'Oct 12, 2023',
    title: 'Best tasting bar on the market',
    content: 'I have tried almost every protein bar out there, and nothing comes close to this. The texture is incredible, not chalky at all. Actually tastes like a candy bar but hits my macros perfectly.',
    verified: true,
  },
  {
    id: 2,
    author: 'Sarah K.',
    rating: 5,
    date: 'Sep 28, 2023',
    title: 'Perfect pre-workout',
    content: 'Gives me the exact energy I need before a heavy lifting session. No stomach issues, super clean ingredients. Will be subscribing for the 24 pack.',
    verified: true,
  },
  {
    id: 3,
    author: 'David L.',
    rating: 4,
    date: 'Sep 15, 2023',
    title: 'Great flavor, a bit dense',
    content: 'Love the peanut butter chunks. It is a bit dense compared to others, but honestly that makes it more filling. Solid 4.5/5.',
    verified: true,
  }
];

export function ProductReviews() {
  return (
    <section className="py-24 border-t border-[#594045]/30 bg-[#0d0e12]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#594045]/30 pb-8">
          <div>
            <h2 className="text-display-hero text-[#e3e2e7] uppercase leading-none mb-4">
              COMMUNITY <span className="text-[#c41e5c] italic">VERIFIED</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex text-[#c41e5c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} fill="currentColor" />
                ))}
              </div>
              <span className="text-[#e3e2e7] font-bold text-lg">4.9 / 5.0</span>
              <span className="text-[#a8898e] text-sm">(1,284 Reviews)</span>
            </div>
          </div>
          <button className="hidden md:block mt-6 md:mt-0 border border-[#c41e5c] text-[#ffb1c1] hover:bg-[#c41e5c]/10 px-8 py-4 font-body text-label-bold text-xs tracking-widest uppercase transition-all rounded-sm">
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <article 
              key={review.id} 
              className="bg-[#1a1b1f] p-8 border border-[#594045]/30 rounded-lg hover:border-[#c41e5c]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-[#c41e5c]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "currentColor" : "transparent"} 
                      className={i >= review.rating ? "text-[#594045]" : ""}
                    />
                  ))}
                </div>
                <span className="text-[#a8898e] text-[10px] uppercase tracking-widest">{review.date}</span>
              </div>
              
              <h4 className="text-[#e3e2e7] font-bold text-lg mb-3 leading-tight">{review.title}</h4>
              <p className="text-[#e1bec3] text-sm leading-relaxed mb-6">
                &quot;{review.content}&quot;
              </p>
              
              <div className="flex items-center gap-3 border-t border-[#594045]/20 pt-4">
                <div className="w-8 h-8 rounded-full bg-[#343539] flex items-center justify-center text-[#e3e2e7] font-bold text-xs uppercase">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <span className="block text-[#e3e2e7] font-bold text-xs uppercase">{review.author}</span>
                  {review.verified && (
                    <span className="text-[#c41e5c] text-[10px] font-bold uppercase tracking-widest">Verified Buyer</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <button className="w-full border border-[#c41e5c] text-[#ffb1c1] hover:bg-[#c41e5c]/10 px-8 py-4 font-body text-label-bold text-xs tracking-widest uppercase transition-all rounded-sm">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}
