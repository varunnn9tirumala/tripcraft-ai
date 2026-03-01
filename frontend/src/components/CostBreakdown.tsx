import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '../utils/formatCurrency';
import type { CostBreakdown as CostBreakdownType } from '../backend';

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType;
  currency?: string;
}

export default function CostBreakdown({ costBreakdown, currency = 'USD' }: CostBreakdownProps) {
  const personCount = Number(costBreakdown.person_count);
  const nightCount = Number(costBreakdown.night_count);
  const flightCostPerPerson = Number(costBreakdown.flight_cost_per_person);
  const accommodationCostPerNight = Number(costBreakdown.accommodation_cost_per_night);
  const totalFlightCost = Number(costBreakdown.total_flight_cost);
  const totalAccommodationCost = Number(costBreakdown.total_accommodation_cost);
  const totalCost = Number(costBreakdown.total_cost);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Total Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Flight Cost ({personCount} {personCount === 1 ? 'person' : 'people'})
            </span>
            <span className="font-semibold">{formatCurrency(totalFlightCost, currency)}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 pl-4">
            {formatCurrency(flightCostPerPerson, currency)} × {personCount} {personCount === 1 ? 'person' : 'people'}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Accommodation Cost ({nightCount} {nightCount === 1 ? 'night' : 'nights'})
            </span>
            <span className="font-semibold">{formatCurrency(totalAccommodationCost, currency)}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 pl-4">
            {formatCurrency(accommodationCostPerNight, currency)} × {personCount} {personCount === 1 ? 'person' : 'people'} × {nightCount} {nightCount === 1 ? 'night' : 'nights'}
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total Cost</span>
          <span className="text-orange-600">{formatCurrency(totalCost, currency)}</span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          All prices are in {currency}
        </p>
      </CardContent>
    </Card>
  );
}
