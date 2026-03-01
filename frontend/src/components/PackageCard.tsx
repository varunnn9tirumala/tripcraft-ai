import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDuration } from '@/utils/formatDate';
import { Plane, Hotel, Clock, Star, MapPin, Utensils, Wifi, CheckCircle2, Gift } from 'lucide-react';
import type { Package } from '@/backend';

interface PackageCardProps {
  pkg: Package;
  numTravelers: number;
  nightCount: number;
  currency: string;
  onSelect: () => void;
  isSelected: boolean;
  addedAmenities: string[];
}

export default function PackageCard({
  pkg,
  numTravelers,
  nightCount,
  currency,
  onSelect,
  isSelected,
  addedAmenities,
}: PackageCardProps) {
  const { flight, accommodation, totalPrice } = pkg;
  const flightPricePerPerson = Number(flight.pricePerPerson);
  const accommodationPricePerNight = Number(accommodation.pricePerNight);
  const totalFlightCost = flightPricePerPerson * numTravelers;
  const totalAccommodationCost = accommodationPricePerNight * nightCount;

  return (
    <Card className={`hover:shadow-xl transition-shadow overflow-hidden ${isSelected ? 'ring-2 ring-orange-600' : ''}`}>
      <CardHeader className="bg-gradient-to-r from-orange-100 to-coral-100 dark:from-orange-900/20 dark:to-coral-900/20">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">Complete Travel Package</CardTitle>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Package Price</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(Number(totalPrice), currency)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Flight Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Plane className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold">Flight Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/plane-icon.dim_400x300.png"
                  alt="Flight"
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-lg">{flight.airline}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Flight {flight.flightNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{formatDuration(Number(flight.durationMinutes))}</span>
                {flight.isDirect ? (
                  <Badge variant="secondary" className="ml-2">Direct</Badge>
                ) : (
                  <Badge variant="outline" className="ml-2">
                    {flight.layovers.length} Stop{flight.layovers.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departure</p>
                <p className="font-semibold">{flight.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Arrival</p>
                <p className="font-semibold">{flight.arrivalTime}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{flight.cabinClass}</Badge>
            <Badge variant="outline">{Number(flight.baggageAllowance)} Bag{Number(flight.baggageAllowance) > 1 ? 's' : ''}</Badge>
            {flight.amenities.map((amenity, idx) => (
              <Badge key={idx} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Flight Cost</p>
            <p className="text-lg font-semibold">
              {formatCurrency(flightPricePerPerson, currency)} × {numTravelers} traveler{numTravelers > 1 ? 's' : ''} = {formatCurrency(totalFlightCost, currency)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Hotel Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-coral-100 dark:bg-coral-900/30 rounded-lg">
              <Hotel className="w-5 h-5 text-coral-600 dark:text-coral-400" />
            </div>
            <h3 className="text-xl font-semibold">Accommodation Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/hotel-icon.dim_400x300.png"
                  alt="Hotel"
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-lg">{accommodation.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Number(accommodation.starRating) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{accommodation.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">{Number(accommodation.guestRating).toFixed(1)}/10</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Guest Rating</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Room Type</p>
                <p className="font-semibold">{accommodation.roomType}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {accommodation.breakfastIncluded && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                Breakfast Included
              </Badge>
            )}
            {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
              <Badge key={idx} variant="outline" className="flex items-center gap-1">
                {amenity === 'Free WiFi' && <Wifi className="w-3 h-3" />}
                {amenity}
              </Badge>
            ))}
            {accommodation.amenities.length > 4 && (
              <Badge variant="outline">+{accommodation.amenities.length - 4} more</Badge>
            )}
          </div>

          <div className="bg-coral-50 dark:bg-coral-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Accommodation Cost</p>
            <p className="text-lg font-semibold">
              {formatCurrency(accommodationPricePerNight, currency)} × {nightCount} night{nightCount > 1 ? 's' : ''} = {formatCurrency(totalAccommodationCost, currency)}
            </p>
          </div>
        </div>

        {/* Added Amenities Section */}
        {addedAmenities.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3 bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Added Amenities (No Extra Cost!)
                </h3>
              </div>
              <ul className="space-y-2">
                {addedAmenities.map((amenity, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Separator />

        {/* Total and Action */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete Package Total</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(Number(totalPrice), currency)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Includes flight for {numTravelers} traveler{numTravelers > 1 ? 's' : ''} + {nightCount} night{nightCount > 1 ? 's' : ''} accommodation
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={onSelect}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {isSelected ? 'Selected' : 'Select Package'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
