export interface City {
  city: string;
  country: string;
  airportCode: string;
  displayName: string;
}

export const cities: City[] = [
  // North America - USA
  { city: 'New York', country: 'USA', airportCode: 'JFK', displayName: 'New York (JFK)' },
  { city: 'Los Angeles', country: 'USA', airportCode: 'LAX', displayName: 'Los Angeles (LAX)' },
  { city: 'Chicago', country: 'USA', airportCode: 'ORD', displayName: 'Chicago (ORD)' },
  { city: 'San Francisco', country: 'USA', airportCode: 'SFO', displayName: 'San Francisco (SFO)' },
  { city: 'Boston', country: 'USA', airportCode: 'BOS', displayName: 'Boston (BOS)' },
  { city: 'Miami', country: 'USA', airportCode: 'MIA', displayName: 'Miami (MIA)' },
  { city: 'Seattle', country: 'USA', airportCode: 'SEA', displayName: 'Seattle (SEA)' },
  { city: 'Las Vegas', country: 'USA', airportCode: 'LAS', displayName: 'Las Vegas (LAS)' },
  { city: 'Washington DC', country: 'USA', airportCode: 'IAD', displayName: 'Washington DC (IAD)' },
  { city: 'Atlanta', country: 'USA', airportCode: 'ATL', displayName: 'Atlanta (ATL)' },
  { city: 'Dallas', country: 'USA', airportCode: 'DFW', displayName: 'Dallas (DFW)' },
  { city: 'Houston', country: 'USA', airportCode: 'IAH', displayName: 'Houston (IAH)' },
  { city: 'Phoenix', country: 'USA', airportCode: 'PHX', displayName: 'Phoenix (PHX)' },
  { city: 'Philadelphia', country: 'USA', airportCode: 'PHL', displayName: 'Philadelphia (PHL)' },
  { city: 'Denver', country: 'USA', airportCode: 'DEN', displayName: 'Denver (DEN)' },
  { city: 'Orlando', country: 'USA', airportCode: 'MCO', displayName: 'Orlando (MCO)' },
  { city: 'San Diego', country: 'USA', airportCode: 'SAN', displayName: 'San Diego (SAN)' },
  { city: 'Portland', country: 'USA', airportCode: 'PDX', displayName: 'Portland (PDX)' },
  { city: 'Austin', country: 'USA', airportCode: 'AUS', displayName: 'Austin (AUS)' },
  { city: 'Nashville', country: 'USA', airportCode: 'BNA', displayName: 'Nashville (BNA)' },
  
  // India - Domestic Routes
  { city: 'Mumbai', country: 'India', airportCode: 'BOM', displayName: 'Mumbai (BOM)' },
  { city: 'Bangalore', country: 'India', airportCode: 'BLR', displayName: 'Bangalore (BLR)' },
  { city: 'Hyderabad', country: 'India', airportCode: 'HYD', displayName: 'Hyderabad (HYD)' },
  { city: 'Delhi', country: 'India', airportCode: 'DEL', displayName: 'Delhi (DEL)' },
  { city: 'Chennai', country: 'India', airportCode: 'MAA', displayName: 'Chennai (MAA)' },
  { city: 'Goa', country: 'India', airportCode: 'GOI', displayName: 'Goa (GOI)' },
  { city: 'Vijayawada', country: 'India', airportCode: 'VGA', displayName: 'Vijayawada (VGA)' },
  { city: 'Kolkata', country: 'India', airportCode: 'CCU', displayName: 'Kolkata (CCU)' },
  { city: 'Pune', country: 'India', airportCode: 'PNQ', displayName: 'Pune (PNQ)' },
  { city: 'Ahmedabad', country: 'India', airportCode: 'AMD', displayName: 'Ahmedabad (AMD)' },
  
  // North America - Canada
  { city: 'Toronto', country: 'Canada', airportCode: 'YYZ', displayName: 'Toronto (YYZ)' },
  { city: 'Vancouver', country: 'Canada', airportCode: 'YVR', displayName: 'Vancouver (YVR)' },
  { city: 'Montreal', country: 'Canada', airportCode: 'YUL', displayName: 'Montreal (YUL)' },
  { city: 'Calgary', country: 'Canada', airportCode: 'YYC', displayName: 'Calgary (YYC)' },
  { city: 'Ottawa', country: 'Canada', airportCode: 'YOW', displayName: 'Ottawa (YOW)' },
  
  // North America - Mexico
  { city: 'Mexico City', country: 'Mexico', airportCode: 'MEX', displayName: 'Mexico City (MEX)' },
  { city: 'Cancun', country: 'Mexico', airportCode: 'CUN', displayName: 'Cancun (CUN)' },
  { city: 'Guadalajara', country: 'Mexico', airportCode: 'GDL', displayName: 'Guadalajara (GDL)' },
  { city: 'Monterrey', country: 'Mexico', airportCode: 'MTY', displayName: 'Monterrey (MTY)' },
  
  // South America
  { city: 'São Paulo', country: 'Brazil', airportCode: 'GRU', displayName: 'São Paulo (GRU)' },
  { city: 'Rio de Janeiro', country: 'Brazil', airportCode: 'GIG', displayName: 'Rio de Janeiro (GIG)' },
  { city: 'Buenos Aires', country: 'Argentina', airportCode: 'EZE', displayName: 'Buenos Aires (EZE)' },
  { city: 'Lima', country: 'Peru', airportCode: 'LIM', displayName: 'Lima (LIM)' },
  { city: 'Bogotá', country: 'Colombia', airportCode: 'BOG', displayName: 'Bogotá (BOG)' },
  { city: 'Santiago', country: 'Chile', airportCode: 'SCL', displayName: 'Santiago (SCL)' },
  
  // Europe - UK & Ireland
  { city: 'London', country: 'UK', airportCode: 'LHR', displayName: 'London (LHR)' },
  { city: 'Manchester', country: 'UK', airportCode: 'MAN', displayName: 'Manchester (MAN)' },
  { city: 'Edinburgh', country: 'UK', airportCode: 'EDI', displayName: 'Edinburgh (EDI)' },
  { city: 'Dublin', country: 'Ireland', airportCode: 'DUB', displayName: 'Dublin (DUB)' },
  
  // Europe - France
  { city: 'Paris', country: 'France', airportCode: 'CDG', displayName: 'Paris (CDG)' },
  { city: 'Nice', country: 'France', airportCode: 'NCE', displayName: 'Nice (NCE)' },
  { city: 'Lyon', country: 'France', airportCode: 'LYS', displayName: 'Lyon (LYS)' },
  
  // Europe - Germany
  { city: 'Frankfurt', country: 'Germany', airportCode: 'FRA', displayName: 'Frankfurt (FRA)' },
  { city: 'Munich', country: 'Germany', airportCode: 'MUC', displayName: 'Munich (MUC)' },
  { city: 'Berlin', country: 'Germany', airportCode: 'BER', displayName: 'Berlin (BER)' },
  
  // Europe - Spain
  { city: 'Madrid', country: 'Spain', airportCode: 'MAD', displayName: 'Madrid (MAD)' },
  { city: 'Barcelona', country: 'Spain', airportCode: 'BCN', displayName: 'Barcelona (BCN)' },
  
  // Europe - Italy
  { city: 'Rome', country: 'Italy', airportCode: 'FCO', displayName: 'Rome (FCO)' },
  { city: 'Milan', country: 'Italy', airportCode: 'MXP', displayName: 'Milan (MXP)' },
  { city: 'Venice', country: 'Italy', airportCode: 'VCE', displayName: 'Venice (VCE)' },
  
  // Europe - Netherlands & Belgium
  { city: 'Amsterdam', country: 'Netherlands', airportCode: 'AMS', displayName: 'Amsterdam (AMS)' },
  { city: 'Brussels', country: 'Belgium', airportCode: 'BRU', displayName: 'Brussels (BRU)' },
  
  // Europe - Switzerland & Austria
  { city: 'Zurich', country: 'Switzerland', airportCode: 'ZRH', displayName: 'Zurich (ZRH)' },
  { city: 'Vienna', country: 'Austria', airportCode: 'VIE', displayName: 'Vienna (VIE)' },
  
  // Middle East
  { city: 'Dubai', country: 'UAE', airportCode: 'DXB', displayName: 'Dubai (DXB)' },
  { city: 'Abu Dhabi', country: 'UAE', airportCode: 'AUH', displayName: 'Abu Dhabi (AUH)' },
  { city: 'Doha', country: 'Qatar', airportCode: 'DOH', displayName: 'Doha (DOH)' },
  { city: 'Istanbul', country: 'Turkey', airportCode: 'IST', displayName: 'Istanbul (IST)' },
  
  // Asia - East Asia
  { city: 'Tokyo', country: 'Japan', airportCode: 'NRT', displayName: 'Tokyo (NRT)' },
  { city: 'Seoul', country: 'South Korea', airportCode: 'ICN', displayName: 'Seoul (ICN)' },
  { city: 'Beijing', country: 'China', airportCode: 'PEK', displayName: 'Beijing (PEK)' },
  { city: 'Shanghai', country: 'China', airportCode: 'PVG', displayName: 'Shanghai (PVG)' },
  { city: 'Hong Kong', country: 'Hong Kong', airportCode: 'HKG', displayName: 'Hong Kong (HKG)' },
  
  // Asia - Southeast Asia
  { city: 'Singapore', country: 'Singapore', airportCode: 'SIN', displayName: 'Singapore (SIN)' },
  { city: 'Bangkok', country: 'Thailand', airportCode: 'BKK', displayName: 'Bangkok (BKK)' },
  { city: 'Kuala Lumpur', country: 'Malaysia', airportCode: 'KUL', displayName: 'Kuala Lumpur (KUL)' },
  { city: 'Bali', country: 'Indonesia', airportCode: 'DPS', displayName: 'Bali (DPS)' },
  { city: 'Manila', country: 'Philippines', airportCode: 'MNL', displayName: 'Manila (MNL)' },
  
  // Oceania
  { city: 'Sydney', country: 'Australia', airportCode: 'SYD', displayName: 'Sydney (SYD)' },
  { city: 'Melbourne', country: 'Australia', airportCode: 'MEL', displayName: 'Melbourne (MEL)' },
  { city: 'Auckland', country: 'New Zealand', airportCode: 'AKL', displayName: 'Auckland (AKL)' },
];

export function filterCities(query: string): City[] {
  if (!query) return cities;
  
  const lowerQuery = query.toLowerCase();
  return cities.filter(
    (city) =>
      city.city.toLowerCase().includes(lowerQuery) ||
      city.airportCode.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  );
}
