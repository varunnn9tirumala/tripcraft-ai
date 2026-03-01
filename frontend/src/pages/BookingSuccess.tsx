import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
                <CheckCircle className="h-20 w-20 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                🎉 Your Trip is Successfully Booked!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                A confirmation email has been sent.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6 text-left">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">What's Next?</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check your email for booking confirmation and details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Save your booking reference number for future reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prepare your travel documents and pack your bags!</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/' })}
                className="bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700 text-white gap-2"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                <Calendar className="h-5 w-5" />
                Plan Another Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
