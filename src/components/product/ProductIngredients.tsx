import { CheckCircle2 } from 'lucide-react';
import type { Product } from '@/config/products';

interface ProductIngredientsProps {
  product: Product;
}

export function ProductIngredients({ product }: ProductIngredientsProps) {
  // Read ingredients from product config, fallback to default if not present
  const ingredients = product.ingredients || (product.category === 'protein-bars' 
    ? ['Premium Whey Protein Isolate', 'Roasted Peanuts', 'Dark Chocolate (70% Cocoa)', 'Dates', 'Almonds', 'Himalayan Pink Salt']
    : ['Roasted Pumpkin Seeds', 'Sunflower Seeds', 'Flaxseeds', 'Chia Seeds', 'Himalayan Pink Salt']);

  const nutritionalInfo = [
    { label: 'Energy (kcal)', per100g: '410', perServing: '205' },
    { label: 'Protein (g)', per100g: '26.0', perServing: '13.0' },
    { label: 'Carbohydrates (g)', per100g: '42.0', perServing: '21.0' },
    { label: 'Total Sugars (g)', per100g: '18.0', perServing: '9.0' },
    { label: 'Added Sugars (g)', per100g: '< 1.0', perServing: '< 0.5' },
    { label: 'Dietary Fiber (g)', per100g: '13.0', perServing: '6.5' },
    { label: 'Total Fat (g)', per100g: '16.0', perServing: '8.0' },
  ];

  return (
    <section className="py-24 border-t border-[#594045]/30 bg-[#121317]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Ingredients Block */}
        <div>
          <h2 className="text-headline-lg text-[#e3e2e7] font-display-hero uppercase mb-6">
            Clean <span className="text-[#c41e5c] italic">Fuel</span>
          </h2>
          <p className="text-[#e1bec3] text-body-lg mb-8">
            We believe in complete transparency. Our products are made with high-quality, whole-food ingredients designed to optimize your performance without artificial fillers.
          </p>
          
          <ul className="space-y-4">
            {ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#c41e5c] shrink-0 mt-0.5" size={20} />
                <span className="text-[#e3e2e7] font-body text-body-md uppercase tracking-wider">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nutritional Facts Table */}
        <div className="bg-[#1a1b1f] border border-[#594045]/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-headline-md text-[#e3e2e7] font-display-hero uppercase mb-6 border-b border-[#594045]/30 pb-4">
            Nutrition Facts
          </h3>
          <div className="flex justify-between text-[#c6c6c7] text-[10px] font-bold uppercase tracking-widest mb-4 px-2">
            <span>Typical Values</span>
            <div className="flex gap-8 text-right">
              <span className="w-16">Per 100g</span>
              <span className="w-16">Per Bar (50g)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {nutritionalInfo.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center text-sm border-b border-[#594045]/10 pb-3 px-2"
              >
                <span className="text-[#e3e2e7] font-bold">{item.label}</span>
                <div className="flex gap-8 text-right font-body text-[#e1bec3]">
                  <span className="w-16">{item.per100g}</span>
                  <span className="w-16">{item.perServing}</span>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-[#a8898e] mt-6 italic text-center">
            * Percent Daily Values are based on a 2,000 calorie diet.
          </p>
        </div>

      </div>
    </section>
  );
}
