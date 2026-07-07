import Image from 'next/image';
import { Star } from 'lucide-react';
import { SectionReveal } from './SectionReveal';
import { ReviewCardAnimations } from './ReviewCardAnimations';

interface Review {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
}

const reviews: Review[] = [
  {
    quote:
      '"Finally a protein bar that doesn\'t taste like cardboard. Choco Peanut is insane!"',
    name: 'ROHAN S.',
    role: 'Competitive Powerlifter',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuU_PIfIG62fuRwlw4wWnCRHWnGcT8iBxlIGDK0Qi_-UqLV1cRAFSICSC3A6Wz_4f7aazQVVUxHX4BgdmILnB2axPJ5dwNlTYG2qQQw2iBBJxmWlHal5AQSpAvmxZAsmgvbxNbFlbwH-4fBnlA4ScRD0DqB5oPQrwerE3JsyDGN5AXiRd9Meed_k-ugYbym3bbU6zN1yx6KgMHDuoyWhlQ6O2ZvJa0986AyLu-wmf_qUynOFENfs9OhrfHaQ2byEfSJJjDMeH0Qmo',
    avatarAlt: 'Portrait of Rohan S., competitive powerlifter',
  },
  {
    quote:
      '"Perfect balance of taste and macros. My go-to post-workout snack every single day."',
    name: 'PRIYA M.',
    role: 'Yoga Instructor',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMOf1Ec9QMx1jW04PmM5N6Rd1AeUJgJge44dv-ka5Bts6PfP5P39cW6jedG6Nz92St1baoHjUal2-GdaBB0GUzoAfDTW6T4ZbubRhenMqcw8XPX_KB7EB0i0ld1ibg3sQUAUuNArFN9drdCYdJkwYvP4oAL0ArZcgaS8_R_e-aAnMsORiYfoP4URcjlENtN_J5UEzc_exbpUboFgj853WaFwuScqWx3x7QIyAEQ_5VXGWcm23uFkCnx_KPpSWKwoxm-5zvVzSvzbE',
    avatarAlt: 'Portrait of Priya M., yoga instructor',
  },
  {
    quote:
      '"Clean ingredients and no weird aftertaste. Love that it has less than 0.5g sugar!"',
    name: 'ANIKET T.',
    role: 'College Athlete',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPz6vZhZ_YeD97Xt8R4Xrx1NcHy7fqpxHDezr7mqt4NukXB4H-rUfGQ_yLd8oQArT2zZd4n5Ixpx1Bx_ZyOsO9WYgyCSjQCSdvQ-W4HXdN26mpWylHIyA1TsbeAOzpj3qr3dFIw3jYrMp1yOK0BQg8OwLTCArwvr2f_u11-1GvCtkRegLuHM1tfZdzfiNH_mmegZWT-WgYLd76NVuEVY7KsEpwaq6YB1S3LDMXcvg1Bi3oQcPD8r7JvxW87w9HKVpAzk-WtwE6Xp0',
    avatarAlt: 'Portrait of Aniket T., college athlete',
  },
];

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <ReviewCardAnimations index={index}>
      <article
        className="bg-[#1e1f23] border border-[#594045]/30 p-10 space-y-6"
        aria-label={`Review by ${review.name}`}
      >
        {/* Stars */}
        <div className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className="text-[#c41e5c] fill-[#c41e5c]"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote>
          <p className="text-body-lg italic text-[#e3e2e7]">{review.quote}</p>
        </blockquote>

        {/* Author */}
        <footer className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c41e5c] shrink-0 relative">
            <Image
              src={review.avatar}
              alt={review.avatarAlt}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-label-bold text-white uppercase">
              {review.name}
            </div>
            <div className="text-label-sm text-[#e1bec3]">{review.role}</div>
          </div>
        </footer>
      </article>
    </ReviewCardAnimations>
  );
}

/**
 * TestimonialsSection — Server Component
 * Stitch: "REAL PEOPLE. REAL RESULTS." section with 3-column review cards.
 * Social proof stats: 4.9/5 average, 100+ gym reviews.
 */
export function TestimonialsSection() {
  return (
    <section
      className="py-[120px] px-6 bg-[#0d0e12] border-y border-[#594045]/20"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <SectionReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-[#c41e5c] text-label-bold uppercase tracking-widest">
                TESTED. TRUSTED. LOVED.
              </span>
              <h2
                id="testimonials-heading"
                className="text-headline-lg uppercase"
              >
                REAL PEOPLE.{' '}
                <em className="not-italic">REAL RESULTS.</em>
              </h2>
            </div>

            {/* Stats */}
            <div className="flex gap-12 shrink-0">
              <div className="text-center">
                <div
                  className="text-headline-md"
                  aria-label="4.9 out of 5 average rating"
                >
                  4.9/5
                </div>
                <div className="text-label-sm uppercase text-[#e1bec3]">
                  AVERAGE RATING
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-headline-md"
                  aria-label="More than 100 gym reviews"
                >
                  100+
                </div>
                <div className="text-label-sm uppercase text-[#e1bec3]">
                  GYM REVIEWS
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Review Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          role="list"
          aria-label="Customer reviews"
        >
          {reviews.map((review, index) => (
            <div key={review.name} role="listitem">
              <ReviewCard review={review} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
