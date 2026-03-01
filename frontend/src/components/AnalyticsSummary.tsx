import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ThumbsUp, Bot, ShoppingCart } from 'lucide-react';
import type { BookingSession } from '@/backend';

interface AnalyticsSummaryProps {
  data: BookingSession[];
}

export default function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const totalSessions = data.length;
  const initialSatisfied = data.filter((s) => s.initialSatisfaction).length;
  const openedSarah = data.filter((s) => s.openedSarahAI).length;
  const postSarahSatisfied = data.filter((s) => s.postSarahSatisfaction).length;
  const proceededToBooking = data.filter((s) => s.proceededToBooking).length;

  const initialSatisfactionRate = totalSessions > 0 ? (initialSatisfied / totalSessions) * 100 : 0;
  const sarahEngagementRate = totalSessions > 0 ? (openedSarah / totalSessions) * 100 : 0;
  const postSarahSatisfactionRate = openedSarah > 0 ? (postSarahSatisfied / openedSarah) * 100 : 0;
  const bookingConversionRate = totalSessions > 0 ? (proceededToBooking / totalSessions) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Users className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All booking sessions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initial Satisfaction</CardTitle>
          <ThumbsUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialSatisfactionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Satisfied without AI ({initialSatisfied}/{totalSessions})
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sarah AI Engagement</CardTitle>
          <Bot className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sarahEngagementRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Opened Sarah AI ({openedSarah}/{totalSessions})
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Booking Conversion</CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingConversionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Proceeded to booking ({proceededToBooking}/{totalSessions})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
