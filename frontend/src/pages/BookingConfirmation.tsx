import React, { useMemo, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Plane, Hotel, Gift, CheckCircle } from 'lucide-react';
import { useSearchTravelOptions } from '@/hooks/useQueries';
import { formatCurrency } from '@/utils/formatCurrency';
import type { TravelSearchParams } from '@/backend';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;

  const params: TravelSearchParams | null = useMemo(() => {
    const { departure_city, destination_city, departure_date, return_date, num_travelers } = searchParams;

    if (!departure_city || !destination_city || !departure_date || !return_date || !num_travelers) {
      return null;
    }

    return {
      departure_city,
      destination_city,
      departure_date,
      return_date,
      num_travelers: Number(num_travelers),
    };
  }, [searchParams]);

  const { data: searchResult } = useSearchTravelOptions(params);

  const amenities = useMemo(() => {
    const amenitiesParam = searchParams.amenities || '';
    return amenitiesParam ? amenitiesParam.split('|||').filter(Boolean) : [];
  }, [searchParams]);

  const nightCount = useMemo(() => {
    if (!params) return 0;
    const departure = new Date(params.departure_date);
    const returnDate = new Date(params.return_date);
    const diffTime = Math.abs(returnDate.getTime() - departure.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [params]);

  const handleConfirmBooking = () => {
    navigate({ to: '/booking/success' });
  };

  if (!params) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Missing booking information. Please start a new search.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!searchResult || searchResult.__kind__ === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Unable to load booking details.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const results = searchResult.success;
  const selectedPackage = results.packages[0];
  const currency = results.currency || 'USD';

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Package not found.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = Number(selectedPackage.totalPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate({ to: '/summary', search: searchParams })} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your travel package details before confirming
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{selectedPackage.flight.airline}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Flight {selectedPackage.flight.flightNumber}
                </p>
              </div>
              <Badge variant={selectedPackage.flight.isDirect ? 'default' : 'secondary'}>
                {selectedPackage.flight.isDirect ? 'Direct' : 'With Layover'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Departure</p>
                <p className="font-medium">{selectedPackage.flight.departureTime}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Arrival</p>
                <p className="font-medium">{selectedPackage.flight.arrivalTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Accommodation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-lg">{selectedPackage.accommodation.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPackage.accommodation.address}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500 dark:text-gray-400">Duration</p>
              <p className="font-medium">{nightCount} night{nightCount > 1 ? 's' : ''}</p>
            </div>
          </CardContent>
        </Card>

        {amenities.length > 0 && (
          <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Gift className="h-5 w-5" />
                Added Amenities (No Extra Cost!)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Flight ({Number(params.num_travelers)} traveler{Number(params.num_travelers) > 1 ? 's' : ''})</span>
              <span className="font-medium">
                {formatCurrency(
                  Number(selectedPackage.flight.pricePerPerson) * Number(params.num_travelers),
                  currency
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Accommodation ({nightCount} night{nightCount > 1 ? 's' : ''})
              </span>
              <span className="font-medium">
                {formatCurrency(
                  Number(selectedPackage.accommodation.pricePerNight) * nightCount * Number(params.num_travelers),
                  currency
                )}
              </span>
            </div>
            {amenities.length > 0 && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Added Amenities</span>
                <span className="font-medium">FREE</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Price</span>
              <span className="text-orange-600 dark:text-orange-400">
                {formatCurrency(totalPrice, currency)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleConfirmBooking}
            className="bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700 text-white px-12 py-6 text-lg"
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
