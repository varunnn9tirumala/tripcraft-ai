import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hotel, MapPin, Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import type { Accommodation } from '../backend';

interface AccommodationCardProps {
  accommodation: Accommodation;
  destination?: string;
  currency?: string;
}

export default function AccommodationCard({ accommodation, destination, currency = 'USD' }: AccommodationCardProps) {
  const pricePerNight = Number(accommodation.pricePerNight);
  const starRating = Number(accommodation.starRating);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Hotel className="h-5 w-5 mr-2 text-orange-600" />
          {accommodation.name || 'Hotel'}
        </CardTitle>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < starRating
                  ? 'fill-orange-500 text-orange-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start text-sm">
          <MapPin className="h-4 w-4 mr-2 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-600 dark:text-gray-400">{accommodation.address || 'Address not available'}</p>
            {destination && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{destination}</p>
            )}
          </div>
        </div>

        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {accommodation.amenities.slice(0, 4).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {accommodation.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{accommodation.amenities.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(pricePerNight, currency)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
        </div>
      </CardContent>
    </Card>
  );
}
