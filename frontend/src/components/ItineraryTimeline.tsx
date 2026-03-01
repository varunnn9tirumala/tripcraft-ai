import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Hotel, Calendar } from 'lucide-react';

interface ItineraryTimelineProps {
  departureDate: string;
  returnDate: string;
  departure: string;
  destination: string;
}

export default function ItineraryTimeline({
  departureDate,
  returnDate,
  departure,
  destination,
}: ItineraryTimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-orange-600" />
          Your Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Departure */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Plane className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Departure Flight</p>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(departureDate)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {departure} → {destination}
              </p>
            </div>
          </div>

          {/* Vertical line */}
          <div className="ml-6 border-l-2 border-orange-300 dark:border-orange-700 h-8" />

          {/* Hotel Stay */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Hotel className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Hotel Stay</p>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(departureDate)} - {formatDate(returnDate)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Accommodation in {destination}
              </p>
            </div>
          </div>

          {/* Vertical line */}
          <div className="ml-6 border-l-2 border-orange-300 dark:border-orange-700 h-8" />

          {/* Return */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Plane className="h-6 w-6 text-orange-600 transform rotate-180" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Return Flight</p>
              <p className="text-gray-600 dark:text-gray-400">{formatDate(returnDate)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {destination} → {departure}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
