import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

module {
  // Old Types
  type OldActor = {
    apiKey : ?Text;
    userSearchHistory : Map.Map<Principal, List.List<OldSearchHistory>>;
    anonymousSearchHistory : Map.Map<Text, List.List<OldSearchHistory>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    currencyMapping : Map.Map<Text, Text>;
  };

  type OldSearchHistory = {
    departure : Text;
    destination : Text;
    departure_date : Text;
    return_date : Text;
    num_travelers : Float;
    timestamp : Time.Time;
  };

  type OldUserProfile = {
    name : Text;
    email : ?Text;
    preferences : ?Text;
  };

  // New Types
  type BookingSession = {
    userName : Text;
    userEmail : Text;
    sourceCity : Text;
    destinationCity : Text;
    packagePrice : Float;
    currency : Text;
    initialSatisfaction : Bool;
    openedSarahAI : Bool;
    postSarahSatisfaction : Bool;
    proceededToBooking : Bool;
    timestamp : Time.Time;
  };

  type NewActor = {
    apiKey : ?Text;
    userSearchHistory : Map.Map<Principal, List.List<OldSearchHistory>>;
    anonymousSearchHistory : Map.Map<Text, List.List<OldSearchHistory>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    currencyMapping : Map.Map<Text, Text>;
    userAnalytics : Map.Map<Principal, List.List<BookingSession>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      userAnalytics = Map.empty<Principal, List.List<BookingSession>>()
    };
  };
};
