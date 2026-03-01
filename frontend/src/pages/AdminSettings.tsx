import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveTravelpayoutKey } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2, CheckCircle, Key } from 'lucide-react';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';

export default function AdminSettings() {
  const navigate = useNavigate();
  const saveTravelpayoutKeyMutation = useSaveTravelpayoutKey();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    try {
      await saveTravelpayoutKeyMutation.mutateAsync(apiKey.trim());
      setShowSuccess(true);
      toast.success('Travelpayout API key saved successfully');
      setApiKey('');
    } catch (error: any) {
      console.error('Error saving API key:', error);
      const errorMessage = error?.message || 'Failed to save API key. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-coral-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate({ to: '/admin' })}
          variant="ghost"
          className="mb-6 hover:bg-orange-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Panel
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure API keys and system settings
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Success!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              Your Travelpayout API key has been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center">
              <Key className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <CardTitle className="text-2xl">Travelpayout API Configuration</CardTitle>
                <CardDescription className="mt-2">
                  Enter your Travelpayout API key to enable real-time flight and hotel search functionality.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveApiKey} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Travelpayout API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Travelpayout API key"
                  className="font-mono"
                  disabled={saveTravelpayoutKeyMutation.isPending}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700"
                disabled={saveTravelpayoutKeyMutation.isPending || !apiKey.trim()}
              >
                {saveTravelpayoutKeyMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save API Key
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
