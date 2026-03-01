import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBookingAnalytics } from '@/hooks/useQueries';
import AdminLogin from '@/components/AdminLogin';
import AnalyticsSummary from '@/components/AnalyticsSummary';
import AnalyticsTable from '@/components/AnalyticsTable';
import { AlertCircle } from 'lucide-react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: analytics, isLoading, error } = useGetBookingAnalytics();

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Research Analytics - User Satisfaction & AI Interaction Data
          </p>
        </div>

        {/* Summary Statistics */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : analytics && analytics.length > 0 ? (
          <AnalyticsSummary data={analytics} />
        ) : null}

        {/* Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Session Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load analytics data. Please try again.
                </AlertDescription>
              </Alert>
            ) : analytics && analytics.length > 0 ? (
              <AnalyticsTable data={analytics} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No analytics data available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
