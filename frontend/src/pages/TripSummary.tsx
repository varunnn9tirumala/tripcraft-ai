import React, { useMemo, useState, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useSearchTravelOptions, useRecordBookingConversion } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PackageCard from '@/components/PackageCard';
import SatisfactionPopup from '@/components/SatisfactionPopup';
import SarahChatPopup from '@/components/SarahChatPopup';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import type { TravelSearchParams, Package } from '@/backend';

export default function TripSummary() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const { identity } = useInternetIdentity();

  const [showInitialSatisfaction, setShowInitialSatisfaction] = useState(false);
  const [userSatisfied, setUserSatisfied] = useState(false);
  const [showSarahChat, setShowSarahChat] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [addedAmenities, setAddedAmenities] = useState<string[]>([]);
  const [showSecondSatisfaction, setShowSecondSatisfaction] = useState(false);
  const [initialSatisfaction, setInitialSatisfaction] = useState<boolean | null>(null);
  const [openedSarahAI, setOpenedSarahAI] = useState(false);
  const [postSarahSatisfaction, setPostSarahSatisfaction] = useState<boolean | null>(null);

  const recordConversionMutation = useRecordBookingConversion();

  // Extract and validate search parameters from URL
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

  // Fetch travel options from backend
  const { data: searchResult, isLoading, error } = useSearchTravelOptions(params);

  // Calculate number of nights
  const nightCount = useMemo(() => {
    if (!params) return 0;
    const departure = new Date(params.departure_date);
    const returnDate = new Date(params.return_date);
    const diffTime = Math.abs(returnDate.getTime() - departure.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [params]);

  // Show satisfaction popup 8 seconds after packages load
  useEffect(() => {
    if (
      searchResult &&
      searchResult.__kind__ === 'success' &&
      searchResult.success.packages.length > 0 &&
      !showInitialSatisfaction &&
      !userSatisfied &&
      !showSarahChat
    ) {
      setSelectedPackage(searchResult.success.packages[0]);
      
      const timer = setTimeout(() => {
        setShowInitialSatisfaction(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [searchResult, showInitialSatisfaction, userSatisfied, showSarahChat]);

  const handleInitialSatisfactionYes = () => {
    setShowInitialSatisfaction(false);
    setUserSatisfied(true);
    setInitialSatisfaction(true);
  };

  const handleInitialSatisfactionNo = () => {
    setShowInitialSatisfaction(false);
    setShowSarahChat(true);
    setInitialSatisfaction(false);
  };

  const handleSarahOpen = () => {
    if (!openedSarahAI) {
      setOpenedSarahAI(true);
    }
  };

  const handleSarahEnhancementComplete = (amenities: string[]) => {
    setAddedAmenities(amenities);
    setTimeout(() => {
      setShowSecondSatisfaction(true);
    }, 6000);
  };

  const handleSecondSatisfactionYes = () => {
    setShowSecondSatisfaction(false);
    setShowSarahChat(false);
    setUserSatisfied(true);
    setPostSarahSatisfaction(true);
  };

  const handleSecondSatisfactionNo = () => {
    setShowSecondSatisfaction(false);
    setPostSarahSatisfaction(false);
  };

  const navigateToConfirmation = async () => {
    if (!selectedPackage || !params || !searchResult || searchResult.__kind__ !== 'success') return;

    // Record booking conversion
    const isUser = !!identity;
    const userId = isUser ? identity.getPrincipal().toString() : 'anonymous';
    const userName = searchParams.userName || 'Guest User';
    const userEmail = searchParams.userEmail || 'guest@example.com';

    try {
      await recordConversionMutation.mutateAsync({
        is_user: isUser,
        user_id: userId,
        userName,
        userEmail,
        sourceCity: params.departure_city,
        destinationCity: params.destination_city,
        packagePrice: Number(selectedPackage.totalPrice),
        currency: searchResult.success.currency || 'USD',
        initialSatisfaction: initialSatisfaction ?? false,
        openedSarahAI,
        postSarahSatisfaction: postSarahSatisfaction ?? false,
        proceededToBooking: true,
      });
    } catch (error) {
      console.error('Failed to record booking conversion:', error);
    }

    navigate({
      to: '/booking/confirmation',
      search: {
        departure_city: params.departure_city,
        destination_city: params.destination_city,
        departure_date: params.departure_date,
        return_date: params.return_date,
        num_travelers: params.num_travelers.toString(),
        package_index: '0',
        amenities: addedAmenities.join('|||'),
      },
    });
  };

  if (!params) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Missing search parameters. Please start a new search.
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-400">Finding the best packages for you...</p>
        </div>
      </div>
    );
  }

  if (error || !searchResult || searchResult.__kind__ === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {searchResult?.__kind__ === 'error' ? searchResult.error : 'Failed to load travel options. Please try again.'}
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

  const results = searchResult.success;
  const currency = results.currency || 'USD';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Button onClick={() => navigate({ to: '/' })} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Travel Packages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {params.departure_city} → {params.destination_city} • {params.num_travelers} traveler{params.num_travelers > 1 ? 's' : ''} • {nightCount} night{nightCount > 1 ? 's' : ''}
          </p>
        </div>

        {results.packages.length > 0 ? (
          <div className="space-y-6">
            {results.packages.map((pkg, index) => (
              <PackageCard
                key={index}
                pkg={pkg}
                nightCount={nightCount}
                numTravelers={params.num_travelers}
                currency={currency}
                onSelect={() => setSelectedPackage(pkg)}
                isSelected={selectedPackage === pkg}
                addedAmenities={selectedPackage === pkg ? addedAmenities : []}
              />
            ))}

            {selectedPackage && userSatisfied && (
              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  onClick={navigateToConfirmation}
                  className="bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700 text-white px-12 py-6 text-lg"
                  disabled={recordConversionMutation.isPending}
                >
                  {recordConversionMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Booking'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No packages available for this route. Please try different dates or destinations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <SatisfactionPopup
        open={showInitialSatisfaction}
        onYes={handleInitialSatisfactionYes}
        onNo={handleInitialSatisfactionNo}
        title="Are you satisfied with this package?"
        description="Let us know if this travel package meets your expectations."
      />

      <SatisfactionPopup
        open={showSecondSatisfaction}
        onYes={handleSecondSatisfactionYes}
        onNo={handleSecondSatisfactionNo}
        title="Are you satisfied with the enhanced package?"
        description="Does the upgraded package with added amenities meet your needs?"
      />

      {selectedPackage && (
        <SarahChatPopup
          open={showSarahChat}
          onClose={() => setShowSarahChat(false)}
          onOpen={handleSarahOpen}
          packageData={selectedPackage}
          originalPrice={Number(selectedPackage.totalPrice)}
          currency={currency}
          onEnhancementComplete={handleSarahEnhancementComplete}
        />
      )}
    </div>
  );
}
