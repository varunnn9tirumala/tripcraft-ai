import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TravelSearchResult = {
    __kind__: "error";
    error: string;
} | {
    __kind__: "success";
    success: SearchResults;
};
export interface KeyboardEvent {
    key: string;
    metaKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    keyCode: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface TravelSearchParams {
    departure_city: string;
    departure_date: string;
    return_date: string;
    num_travelers: number;
    destination_city: string;
}
export interface Flight {
    cabinClass: string;
    isDirect: boolean;
    baggageAllowance: number;
    arrivalTime: string;
    flightNumber: string;
    cancellationPolicy: string;
    departureTime: string;
    pricePerPerson: number;
    amenities: Array<string>;
    layovers: Array<Layover>;
    durationMinutes: number;
    airline: string;
}
export interface Layover {
    durationMinutes: number;
    airport: string;
}
export interface SearchResults {
    cost_breakdown: CostBreakdown;
    top_accommodations: Array<Accommodation>;
    packages: Array<Package>;
    departure_city: string;
    available_flights: Array<Flight>;
    currency: string;
    destination_city: string;
    available_dates: Array<string>;
    price_range: string;
}
export interface BookingSession {
    userName: string;
    userEmail: string;
    openedSarahAI: boolean;
    postSarahSatisfaction: boolean;
    packagePrice: number;
    initialSatisfaction: boolean;
    destinationCity: string;
    sourceCity: string;
    currency: string;
    proceededToBooking: boolean;
    timestamp: Time;
}
export interface Package {
    flight: Flight;
    accommodation: Accommodation;
    amenities: Array<string>;
    totalPrice: number;
}
export interface SearchHistory {
    destination: string;
    departure_date: string;
    return_date: string;
    timestamp: Time;
    num_travelers: number;
    departure: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AIResponse {
    personality: string;
    message: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type OutcallResult = {
    __kind__: "error";
    error: OutcallError;
} | {
    __kind__: "success";
    success: string;
};
export interface CostBreakdown {
    total_accommodation_cost: number;
    total_flight_cost: number;
    accommodation_cost_per_night: number;
    flight_cost_per_person: number;
    total_cost: number;
    night_count: number;
    person_count: number;
}
export type AnonymousSearchKey = string;
export interface Accommodation {
    contactInfo: string;
    starRating: number;
    reviews: Array<Review>;
    cancellationPolicy: string;
    pricePerNight: number;
    name: string;
    amenities: Array<string>;
    guestRating: number;
    address: string;
    breakfastIncluded: boolean;
    distanceToAirportKm: number;
    roomType: string;
}
export interface Review {
    date: string;
    reviewerName: string;
    comment: string;
    rating: number;
}
export interface UserProfile {
    name: string;
    email?: string;
    preferences?: string;
}
export enum OutcallError {
    invalid_city_name = "invalid_city_name",
    outcall_failed = "outcall_failed",
    api_limit_exceeded = "api_limit_exceeded",
    invalid_url = "invalid_url",
    invalid_api_key = "invalid_api_key",
    no_credentials_found = "no_credentials_found"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllSearchHistory(): Promise<Array<[Principal, Array<SearchHistory>]>>;
    getAnonymousSearchHistory(key: AnonymousSearchKey): Promise<Array<SearchHistory> | null>;
    getBookingAnalytics(): Promise<Array<BookingSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepartureCities(): Promise<Array<string>>;
    getDestinationCities(): Promise<Array<string>>;
    getDummyOutcall(): Promise<OutcallResult>;
    getHotels(_params: TravelSearchParams): Promise<Array<Accommodation>>;
    getSarahResponse(userInput: string): Promise<AIResponse>;
    getSearchHistory(): Promise<Array<SearchHistory>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handleKeyboardEvent(_event: KeyboardEvent): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    recordBookingConversion(is_user: boolean, user_id: string, userName: string, userEmail: string, sourceCity: string, destinationCity: string, packagePrice: number, currency: string, initialSatisfaction: boolean, openedSarahAI: boolean, postSarahSatisfaction: boolean, proceededToBooking: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTravelOptions(params: TravelSearchParams): Promise<TravelSearchResult>;
    setApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCurrencyMapping(): Promise<void>;
    validateAdminCredentials(suppliedUsername: string, suppliedPassword: string): Promise<boolean>;
}
