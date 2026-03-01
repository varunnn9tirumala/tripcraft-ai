import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  TravelSearchParams,
  TravelSearchResult,
  UserProfile,
  BookingSession,
  AIResponse,
} from '@/backend';
import type { SearchHistory } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export type { SearchHistory };

export function useSearchTravelOptions(params: TravelSearchParams | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TravelSearchResult>({
    queryKey: ['travelSearch', params],
    queryFn: async () => {
      if (!actor || !params) throw new Error('Actor or params not available');
      return actor.searchTravelOptions(params);
    },
    enabled: !!actor && !isFetching && !!params,
  });
}

export function useGetSarahResponse() {
  const { actor } = useActor();

  return useMutation<AIResponse, Error, string>({
    mutationFn: async (userInput: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSarahResponse(userInput);
    },
  });
}

export function useGetSearchHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<SearchHistory[]>({
    queryKey: ['searchHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSearchHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSearchHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<[Principal, SearchHistory[]][]>({
    queryKey: ['allSearchHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllSearchHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSaveTravelpayoutKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (apiKey: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApiKey(apiKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelSearch'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useValidateAdminCredentials() {
  const { actor } = useActor();

  return useMutation<boolean, Error, { username: string; password: string }>({
    mutationFn: async ({ username, password }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateAdminCredentials(username, password);
    },
  });
}

export function useRecordBookingConversion() {
  const { actor } = useActor();

  return useMutation<
    void,
    Error,
    {
      is_user: boolean;
      user_id: string;
      userName: string;
      userEmail: string;
      sourceCity: string;
      destinationCity: string;
      packagePrice: number;
      currency: string;
      initialSatisfaction: boolean;
      openedSarahAI: boolean;
      postSarahSatisfaction: boolean;
      proceededToBooking: boolean;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordBookingConversion(
        data.is_user,
        data.user_id,
        data.userName,
        data.userEmail,
        data.sourceCity,
        data.destinationCity,
        data.packagePrice,
        data.currency,
        data.initialSatisfaction,
        data.openedSarahAI,
        data.postSarahSatisfaction,
        data.proceededToBooking
      );
    },
  });
}

export function useGetBookingAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingSession[]>({
    queryKey: ['bookingAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBookingAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// Placeholder hooks for components that use backend city data
export function useGetDepartureCities() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['departureCities'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDepartureCities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDestinationCities() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['destinationCities'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDestinationCities();
    },
    enabled: !!actor && !isFetching,
  });
}
