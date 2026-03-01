export type IntentCategory = 'beach' | 'romantic' | 'adventure' | 'local' | null;

const keywordMap: Record<string, string[]> = {
  beach: ['beach', 'water', 'surf', 'swim', 'ocean', 'sea', 'coastal', 'sand'],
  romantic: ['romantic', 'couple', 'honeymoon', 'anniversary', 'love', 'intimate', 'candlelight'],
  adventure: ['adventure', 'trek', 'hike', 'thrill', 'extreme', 'climb', 'explore', 'outdoor'],
  local: ['local', 'culture', 'authentic', 'traditional', 'heritage', 'native', 'indigenous'],
};

const amenitySuggestions: Record<string, string[]> = {
  beach: [
    'Water sports package (kayaking, snorkeling) 🏄',
    'Beach cabana rental 🏖️',
    'Sunset beach tour 🌅',
  ],
  romantic: [
    'Candlelight dinner for two 🕯️',
    'Sunset cruise experience 🛥️',
    'Couples spa treatment 💆',
  ],
  adventure: [
    'Guided trekking expedition 🥾',
    'Adventure park access 🎢',
    'Mountain biking tour 🚵',
  ],
  local: [
    'Guided cultural city tour 🏛️',
    'Traditional cooking class 🍲',
    'Local artisan workshop visit 🎨',
  ],
};

export function detectIntent(userInput: string): IntentCategory {
  const lowerInput = userInput.toLowerCase();
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((keyword) => lowerInput.includes(keyword))) {
      return category as IntentCategory;
    }
  }
  
  return null;
}

export function getAmenitySuggestions(intent: IntentCategory): string[] {
  if (!intent) return [];
  return amenitySuggestions[intent] || [];
}
