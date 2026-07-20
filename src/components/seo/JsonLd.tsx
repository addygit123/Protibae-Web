/**
 * JsonLd — Server Component for injecting JSON-LD structured data.
 *
 * Usage:
 *   import { JsonLd } from '@/components/seo/JsonLd';
 *   <JsonLd data={generateProductJsonLd(product)} />
 *
 * Renders a <script type="application/ld+json"> tag.
 * This is a Server Component — no client-side overhead.
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | readonly Record<string, any>[];
  id?: string;
}

/**
 * Injects a JSON-LD script tag for structured data.
 * Accepts a single schema object or an array of schemas (graph pattern).
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const schema = Array.isArray(data)
    ? {
        '@context': 'https://schema.org',
        '@graph': data,
      }
    : data;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
