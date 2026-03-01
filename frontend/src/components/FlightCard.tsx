import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDuration } from '../utils/formatDate';
import type { Flight } from '../backend';

interface FlightCardProps {
  flight: Flight;
  departure?: string;
  destination?: string;
  currency?: string;
}

export default function FlightCard({ flight, departure, destination, currency = 'USD' }: FlightCardProps) {
  const pricePerPerson = Number(flight.pricePerPerson);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Plane className="h-5 w-5 mr-2 text-orange-600" />
            {flight.airline || 'Airline'}
          </CardTitle>
          <Badge variant="secondary">{flight.flightNumber || 'N/A'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Information */}
        {departure && destination && (
          <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-orange-600" />
              <span className="font-semibold">{departure}</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-orange-600" />
              <span className="font-semibold">{destination}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Departure</p>
            <p className="font-semibold flex items-center">
              <Clock className="h-4 w-4 mr-1 text-orange-600" />
              {flight.departureTime || 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-semibold">{formatDuration(Number(flight.durationMinutes))}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400">Arrival</p>
            <p className="font-semibold flex items-center justify-end">
              <Clock className="h-4 w-4 mr-1 text-orange-600" />
              {flight.arrivalTime || 'N/A'}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(pricePerPerson, currency)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
        </div>
      </CardContent>
    </Card>
  );
}
