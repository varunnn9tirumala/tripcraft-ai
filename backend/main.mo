import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Migration "migration";
import Runtime "mo:core/Runtime";

(with migration = Migration.run)
actor {
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

  type UserProfile = {
    name : Text;
    email : ?Text;
    preferences : ?Text;
  };

  type Flight = {
    airline : Text;
    flightNumber : Text;
    departureTime : Text;
    arrivalTime : Text;
    pricePerPerson : Float;
    isDirect : Bool;
    layovers : [Layover];
    durationMinutes : Float;
    cabinClass : Text;
    cancellationPolicy : Text;
    baggageAllowance : Float;
    amenities : [Text];
  };

  type Layover = {
    airport : Text;
    durationMinutes : Float;
  };

  type Accommodation = {
    name : Text;
    address : Text;
    starRating : Float;
    amenities : [Text];
    pricePerNight : Float;
    guestRating : Float;
    cancellationPolicy : Text;
    roomType : Text;
    breakfastIncluded : Bool;
    distanceToAirportKm : Float;
    reviews : [Review];
    contactInfo : Text;
  };

  type Review = {
    reviewerName : Text;
    rating : Float;
    comment : Text;
    date : Text;
  };

  type Package = {
    flight : Flight;
    accommodation : Accommodation;
    amenities : [Text];
    totalPrice : Float;
  };

  type CostBreakdown = {
    person_count : Float;
    night_count : Float;
    flight_cost_per_person : Float;
    accommodation_cost_per_night : Float;
    total_flight_cost : Float;
    total_accommodation_cost : Float;
    total_cost : Float;
  };

  type SearchResults = {
    departure_city : Text;
    destination_city : Text;
    available_dates : [Text];
    available_flights : [Flight];
    top_accommodations : [Accommodation];
    packages : [Package];
    cost_breakdown : CostBreakdown;
    currency : Text;
    price_range : Text;
  };

  type SearchHistory = {
    departure : Text;
    destination : Text;
    departure_date : Text;
    return_date : Text;
    num_travelers : Float;
    timestamp : Time.Time;
  };

  type AIResponse = {
    message : Text;
    personality : Text;
  };

  public type TravelSearchParams = {
    departure_city : Text;
    destination_city : Text;
    departure_date : Text;
    return_date : Text;
    num_travelers : Float;
  };

  public type TravelPackageParams = {
    departure_city : Text;
    destination_city : Text;
    departure_date : Text;
    return_date : Text;
    num_travelers : Float;
    travel_type : Text;
    budget : Float;
    currency : Text;
  };

  public type TravelPackageResult = {
    #success : {
      available_packages : [Package];
      cost_breakdown : CostBreakdown;
      currency : Text;
    };
    #error : Text;
  };

  public type TravelSearchResult = {
    #success : SearchResults;
    #error : Text;
  };

  public type AnonymousSearchKey = Text;

  type OutcallError = {
    #invalid_api_key;
    #invalid_url;
    #no_credentials_found;
    #outcall_failed;
    #invalid_city_name;
    #api_limit_exceeded;
  };

  type OutcallResult = {
    #success : Text;
    #error : OutcallError;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state
  var apiKey : ?Text = null;
  let userSearchHistory = Map.empty<Principal, List.List<SearchHistory>>();
  let anonymousSearchHistory = Map.empty<AnonymousSearchKey, List.List<SearchHistory>>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  let currencyMapping = Map.empty<Text, Text>();
  let userAnalytics = Map.empty<Principal, List.List<BookingSession>>();
  let adminUsername = "admin";
  let adminPassword = "backendpassword123";

  let amenities : [Text] = [
    "Free airport pickup 👔 🆙",
    "Complimentary breakfast 🍽️🍳",
    "Guided city tour 🚕🗺️",
    "Room upgrade (subject to availability) 🏨⭐️",
    "Early check-in ⏰⏩",
    "Welcome dinner 🥂🍽️",
    "Travel insurance 🛡️✈️",
    "VIP lounge access 🚝🏢",
    "Fitness center access 🏋️♂️💪",
    "Spa treatment package 🧖♂️💆♀️",
  ];

  let cities = [
    // US cities
    "NYC", "LA", "DFW", "JFK", "LAX", "ORD", "BOS", "SEA",
    "PHX", "MIA", "ATL", "DEN", "SFO", "MCO", "IAH", "CLT",
    "DCA", "PHL", "DTW", "MSP", "BWI", "FLL", "LAS", "MKE",
    "SLC", "SAN", "TPA", "HNL", "STL", "PDX", "RDU", "STT",
    "AUS", "SJC", "CLE", "EWR", "JAX", "MDW", "PIT", "BNA",
    "DAL", "RIC", "ONT", "TUS", "SMF", "COS", "CVG", "BUR",
    "IND", "MSY", "OAK", "ORF", "RNO", "SAT", "SNA", "TUL",
    "ANC", "BOI", "BUF", "BTR", "BTV", "CHS", "CRP", "DAY",
    "DSM", "ECP", "ELP", "EVV", "FAT", "FWA", "GRB", "HNL",
    "LBB", "LIT", "MAF", "MHT", "MLI", "OMA", "PWM", "ROA",
    "SAV", "SHV", "SPI", "TLH", "TYS", "YUM",
    // India cities
    "Mumbai", "Bombay", "BOM", "Pune", "PUN",
    "Bangalore", "Bangalore", "BENG", "DEL", "DELHI",
    "Hyderabad", "Hyd", "Chennai", "MAD", "MAA", "BLR", "GOI", "VGA", "Kolkata"
  ];

  let indiaAirports = [
    "BOM", "BLR", "HYD", "DEL", "MAA", "GOI", "VGA", "CCU",
    "PNQ", "AMD"
  ];

  func isValidCity(city : Text) : Bool {
    switch (cities.find(func(valid) { Text.equal(valid, city) })) {
      case (?_) { true };
      case (_) { false };
    };
  };

  func isIndiaDomesticRoute(departure : Text, destination : Text) : Bool {
    func checkAirport(city : Text, airports : [Text], nonAirport : Text) : Bool {
      switch (airports.find(func(valid) { Text.equal(valid, city) })) {
        case (?airport) { true };
        case (_) {
          Text.equal(city, nonAirport);
        };
      };
    };

    checkAirport(departure, indiaAirports, "Mumbai") and checkAirport(destination, indiaAirports, "Mumbai");
  };

  type KeyboardEvent = {
    key : Text;
    keyCode : Int;
    shiftKey : Bool;
    ctrlKey : Bool;
    altKey : Bool;
    metaKey : Bool;
  };

  public query ({ caller }) func handleKeyboardEvent(_event : KeyboardEvent) : async Text {
    "No action.";
  };

  public shared ({ caller }) func setApiKey(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set API key");
    };
    apiKey := ?key;
  };

  public shared ({ caller }) func getDummyOutcall() : async OutcallResult {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access test endpoints");
    };
    await makeGetOutcall("https://restcountries.com/v3.1/all");
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeGetOutcall(url : Text) : async OutcallResult {
    switch (apiKey) {
      case (null) { #error(#no_credentials_found) };
      case (?key) {
        let headers : [OutCall.Header] = [{
          name = "X-API-KEY";
          value = key;
        }];
        try {
          let response = await OutCall.httpGetRequest(url, headers, transform);
          #success(response);
        } catch (e) {
          #error(#outcall_failed);
        };
      };
    };
  };

  public shared ({ caller }) func validateAdminCredentials(suppliedUsername : Text, suppliedPassword : Text) : async Bool {
    let isUsernameValid = suppliedUsername == adminUsername;
    let isPasswordValid = suppliedPassword == adminPassword;
    isUsernameValid and isPasswordValid;
  };

  func validateSearchParams(params : TravelSearchParams) : ?Text {
    if (not isValidCity(params.departure_city)) {
      return ?("Invalid departure city: " # params.departure_city);
    };

    if (not isValidCity(params.destination_city)) {
      return ?("Invalid destination city: " # params.destination_city);
    };

    if (params.departure_city == params.destination_city) {
      return ?("Departure and destination cities cannot be the same: " # params.departure_city);
    };

    if (params.num_travelers <= 0) {
      return ?("Number of travelers must be greater than 0");
    };

    if (params.num_travelers > 10) {
      return ?("Number of travelers cannot exceed 10");
    };

    if (params.departure_date == "" or params.return_date == "") {
      return ?("Invalid departure or return date");
    };

    null;
  };

  public query ({ caller }) func getDepartureCities() : async [Text] {
    cities;
  };

  public query ({ caller }) func getDestinationCities() : async [Text] {
    cities;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func fetchFlights(_params : TravelSearchParams) : async [Flight] {
    [];
  };

  func fetchHotels(_params : TravelSearchParams) : async [Accommodation] {
    [];
  };

  public query ({ caller }) func getHotels(_params : TravelSearchParams) : async [Accommodation] {
    [];
  };

  public shared ({ caller }) func searchTravelOptions(params : TravelSearchParams) : async TravelSearchResult {
    switch (validateSearchParams(params)) {
      case (?error) { return #error(error) };
      case (null) {};
    };

    let flights = generateMockFlights(params);
    let accommodations = generateMockAccommodations();
    let packages = createPackages(flights, accommodations);
    let costBreakdown = calculateCostBreakdown(params.num_travelers, 6, flights, accommodations);

    let timestamp = Time.now();

    let newSearch : SearchHistory = {
      departure = params.departure_city;
      destination = params.destination_city;
      departure_date = params.departure_date;
      return_date = params.return_date;
      num_travelers = params.num_travelers;
      timestamp;
    };

    switch (caller.toText()) {
      case ("2vxsx-fae") {
        let uniqueKey = generateAnonymousSearchKey(params);
        let currentHistory = switch (anonymousSearchHistory.get(uniqueKey)) {
          case (?history) { history };
          case null { List.empty<SearchHistory>() };
        };
        if (currentHistory.size() < 100) {
          currentHistory.add(newSearch);
          anonymousSearchHistory.add(uniqueKey, currentHistory);
        };
      };
      case (_) {
        let currentHistory = switch (userSearchHistory.get(caller)) {
          case (?history) { history };
          case null { List.empty<SearchHistory>() };
        };
        currentHistory.add(newSearch);
        userSearchHistory.add(caller, currentHistory);
      };
    };

    #success({
      departure_city = params.departure_city;
      destination_city = params.destination_city;
      available_dates = [params.departure_date, params.return_date];
      available_flights = flights;
      top_accommodations = accommodations;
      packages;
      cost_breakdown = costBreakdown;
      currency = "USD";
      price_range = "Variable";
    });
  };

  public shared ({ caller }) func recordBookingConversion(
    is_user : Bool,
    user_id : Text,
    userName : Text,
    userEmail : Text,
    sourceCity : Text,
    destinationCity : Text,
    packagePrice : Float,
    currency : Text,
    initialSatisfaction : Bool,
    openedSarahAI : Bool,
    postSarahSatisfaction : Bool,
    proceededToBooking : Bool,
  ) : async () {
    let principal = if (is_user) {
      Principal.fromText(user_id);
    } else {
      Principal.fromText("2vxsx-fae");
    };

    let bookingSession : BookingSession = {
      userName;
      userEmail;
      sourceCity;
      destinationCity;
      packagePrice;
      currency;
      initialSatisfaction;
      openedSarahAI;
      postSarahSatisfaction;
      proceededToBooking;
      timestamp = Time.now();
    };

    let currentAnalytics = switch (userAnalytics.get(principal)) {
      case (?analyticsList) { analyticsList };
      case null { List.empty<BookingSession>() };
    };

    currentAnalytics.add(bookingSession);
    userAnalytics.add(principal, currentAnalytics);
  };

  public query ({ caller }) func getBookingAnalytics() : async [BookingSession] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch analytics");
    };
    let sessions = List.empty<BookingSession>();
    for ((_, analytics) in userAnalytics.entries()) {
      for (session in analytics.values()) {
        sessions.add(session);
      };
    };
    sessions.toArray();
  };

  public query ({ caller }) func getSearchHistory() : async [SearchHistory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view search history");
    };
    switch (userSearchHistory.get(caller)) {
      case (?history) { history.toArray() };
      case null { [] };
    };
  };

  public query ({ caller }) func getAllSearchHistory() : async [(Principal, [SearchHistory])] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all search history");
    };
    userSearchHistory.entries().toArray().map<(Principal, List.List<SearchHistory>), (Principal, [SearchHistory])>(
      func((p, l)) { (p, l.toArray()) }
    );
  };

  public query ({ caller }) func getAnonymousSearchHistory(key : AnonymousSearchKey) : async ?[SearchHistory] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view anonymous search history");
    };
    switch (anonymousSearchHistory.get(key)) {
      case (?history) {
        let arr = history.toArray();
        if (arr.size() == 0) { null } else { ?arr };
      };
      case null { null };
    };
  };

  public query ({ caller }) func getSarahResponse(userInput : Text) : async AIResponse {
    if (userInput.contains(#text "hello")) {
      return makeAIResponse(
        "Hello! I'm here to assist you with all your travel needs. Just let me know how I can do a little more for you! 😊",
        "Sarah",
      );
    };

    if (userInput.contains(#text "thank you")) {
      return makeAIResponse(
        "You're very welcome! Always happy to enhance your experience. 😊",
        "Sarah",
      );
    };

    if (userInput.contains(#text "compare flights")) {
      return makeAIResponse(
        "I've compared the flights for you! Let's find the best match based on your needs. 📊✈️",
        "Sarah",
      );
    };

    makeAIResponse(
      "Thank you for your message! I'll do my best to help you find the perfect travel options. 😊",
      "Sarah",
    );
  };

  func calculateCostBreakdown(personCount : Float, nightCount : Float, flights : [Flight], accommodations : [Accommodation]) : CostBreakdown {
    let flightCostPerPerson = if (flights.size() > 0) {
      flights[0].pricePerPerson;
    } else {
      0.0;
    };

    let accommodationCostPerNight = if (accommodations.size() > 0) {
      accommodations[0].pricePerNight;
    } else {
      0.0;
    };

    let totalFlightCost = flightCostPerPerson * personCount;
    let totalAccommodationCost = accommodationCostPerNight * personCount * nightCount;
    let totalCost = totalFlightCost + totalAccommodationCost;

    {
      person_count = personCount;
      night_count = nightCount;
      flight_cost_per_person = flightCostPerPerson;
      accommodation_cost_per_night = accommodationCostPerNight;
      total_flight_cost = totalFlightCost;
      total_accommodation_cost = totalAccommodationCost;
      total_cost = totalCost;
    };
  };

  func convertNatsToFloats(nats : [Nat]) : [Float] {
    nats.map(func(nat) { nat.toFloat() });
  };

  func generateAnonymousSearchKey(params : TravelSearchParams) : AnonymousSearchKey {
    params.departure_city # params.destination_city # params.departure_date # params.return_date # params.num_travelers.toText() # Time.now().toText();
  };

  func makeAIResponse(message : Text, personality : Text) : AIResponse {
    { message; personality };
  };

  func generateMockFlights(_params : TravelSearchParams) : [Flight] {
    [
      {
        airline = "American Airlines";
        flightNumber = "AA1423";
        departureTime = "Feb 21, 2026 08:15 AM";
        arrivalTime = "Feb 21, 2026 09:55 AM";
        pricePerPerson = 225;
        isDirect = true;
        layovers = [];
        durationMinutes = 160;
        cabinClass = "Economy";
        cancellationPolicy = "Non-refundable";
        baggageAllowance = 1;
        amenities = ["WiFi", "In-flight Meal"];
      },
      {
        airline = "Delta";
        flightNumber = "DL2456";
        departureTime = "Feb 21, 2026 09:30 AM";
        arrivalTime = "Feb 21, 2026 11:10 AM";
        pricePerPerson = 205;
        isDirect = true;
        layovers = [];
        durationMinutes = 220;
        cabinClass = "Economy";
        cancellationPolicy = "Non-refundable";
        baggageAllowance = 1;
        amenities = ["WiFi"];
      },
      {
        airline = "United";
        flightNumber = "UA1789";
        departureTime = "Feb 21, 2026 10:45 AM";
        arrivalTime = "Feb 21, 2026 02:25 PM";
        pricePerPerson = 195;
        isDirect = false;
        layovers = [
          {
            airport = "PHX";
            durationMinutes = 55;
          }
        ];
        durationMinutes = 220;
        cabinClass = "Economy";
        cancellationPolicy = "Non-refundable";
        baggageAllowance = 1;
        amenities = [];
      },
      {
        airline = "Southwest";
        flightNumber = "WN3306";
        departureTime = "Feb 21, 2026 12:15 PM";
        arrivalTime = "Feb 21, 2026 05:00 PM";
        pricePerPerson = 185;
        isDirect = false;
        layovers = [
          {
            airport = "DEN";
            durationMinutes = 85;
          }
        ];
        durationMinutes = 285;
        cabinClass = "Economy";
        cancellationPolicy = "Fully refundable";
        baggageAllowance = 2;
        amenities = ["Extra Legroom"];
      },
      {
        airline = "American Airlines";
        flightNumber = "AA2140";
        departureTime = "Feb 21, 2026 02:35 PM";
        arrivalTime = "Feb 21, 2026 04:15 PM";
        pricePerPerson = 215;
        isDirect = true;
        layovers = [];
        durationMinutes = 220;
        cabinClass = "Economy";
        cancellationPolicy = "Non-refundable";
        baggageAllowance = 1;
        amenities = ["In-flight Meal"];
      },
    ];
  };

  func generateMockAccommodations() : [Accommodation] {
    [
      {
        name = "Hollywood Budget Hostel";
        address = "6800 Hollywood Blvd, Los Angeles, CA";
        starRating = 2;
        amenities = ["Free WiFi", "Breakfast Included", "Shared Kitchen"];
        pricePerNight = 38;
        guestRating = 7.1;
        cancellationPolicy = "24 hour full refund";
        roomType = "Shared Dorm";
        breakfastIncluded = true;
        distanceToAirportKm = 30.5;
        reviews = [
          {
            reviewerName = "Samantha";
            rating = 9;
            comment = "Great location and amazing value for money";
            date = "2024-07-20";
          },
          {
            reviewerName = "Jake";
            rating = 7;
            comment = "Basic but clean and had everything I needed";
            date = "2024-06-11";
          },
        ];
        contactInfo = "Phone: (555) 123-4567, Email: info@hollywoodbudgethostel.com";
      },
      {
        name = "Rodeway Inn LAX";
        address = "301 W. Manchester Blvd, Los Angeles, CA";
        starRating = 3;
        amenities = ["Free WiFi", "Free Parking", "Breakfast Included"];
        pricePerNight = 61;
        guestRating = 6.6;
        cancellationPolicy = "Non-refundable";
        roomType = "Private Room";
        breakfastIncluded = true;
        distanceToAirportKm = 3.5;
        reviews = [
          {
            reviewerName = "Maria";
            rating = 7;
            comment = "Close to LAX and good for a quick layover";
            date = "2024-06-02";
          },
          {
            reviewerName = "Ben";
            rating = 6;
            comment = "Decent for the price but rooms are quite basic";
            date = "2024-04-27";
          },
        ];
        contactInfo = "Phone: (555) 234-5678, Email: info@rodewayinnlax.com";
      },
      {
        name = "Hollywood Stay Hotel";
        address = "1519 Vermont Ave, Los Angeles, CA";
        starRating = 2;
        amenities = ["Free WiFi", "Air Conditioning", "Luggage Storage"];
        pricePerNight = 49;
        guestRating = 7.8;
        cancellationPolicy = "Non-refundable";
        roomType = "Private Room";
        breakfastIncluded = false;
        distanceToAirportKm = 26.3;
        reviews = [
          {
            reviewerName = "Nina";
            rating = 8;
            comment = "Awesome for solo travelers and close to attractions";
            date = "2024-05-18";
          },
          {
            reviewerName = "Tyler";
            rating = 7;
            comment = "Clean and budget-friendly, perfect for backpackers";
            date = "2024-02-13";
          },
        ];
        contactInfo = "Phone: (555) 174-6039, Email: info@hollywoodstayhotel.com";
      },
      {
        name = "Samesun Venice Beach Hostel";
        address = "25 Windward Ave, Los Angeles, CA";
        starRating = 3;
        amenities = ["Free WiFi", "Beach Access", "Bike Rentals"];
        pricePerNight = 44;
        guestRating = 8.2;
        cancellationPolicy = "48 hour refund";
        roomType = "Dorm Room";
        breakfastIncluded = true;
        distanceToAirportKm = 14.2;
        reviews = [
          {
            reviewerName = "Emily";
            rating = 9;
            comment = "Fantastic location and really sociable atmosphere!";
            date = "2024-03-07";
          },
          {
            reviewerName = "Chris";
            rating = 8;
            comment = "Clean facilities and perfect for budget travelers";
            date = "2023-10-12";
          },
        ];
        contactInfo = "Phone: (555) 953-2112, Email: info@samesun.com";
      },
      {
        name = "Hostelling International LA";
        address = "1616 Wilshire Blvd, Los Angeles, CA";
        starRating = 4;
        amenities = ["Free WiFi", "Shared Kitchen", "Laundry Facilities"];
        pricePerNight = 73;
        guestRating = 8.9;
        cancellationPolicy = "Flexible";
        roomType = "Dorm and Private Rooms";
        breakfastIncluded = true;
        distanceToAirportKm = 30.1;
        reviews = [
          {
            reviewerName = "Laura";
            rating = 10;
            comment = "Hands down the best hostel I've stayed in";
            date = "2024-07-03";
          },
          {
            reviewerName = "Eric";
            rating = 9;
            comment = "Clean, safe, and well-maintained with tons of amenities";
            date = "2024-05-27";
          },
        ];
        contactInfo = "Phone: (555) 921-4178, Email: info@hila.com";
      },
    ];
  };

  func createPackages(flights : [Flight], accommodations : [Accommodation]) : [Package] {
    let maxPackages = 3;
    var packages = List.empty<Package>();
    var count : Nat = 0;

    for (flight in flights.values()) {
      for (accommodation in accommodations.values()) {
        if (count < maxPackages) {
          let package : Package = {
            flight;
            accommodation;
            amenities = [];
            totalPrice = flight.pricePerPerson + (accommodation.pricePerNight * 7);
          };
          packages.add(package);
          count += 1;
        };
      };
    };
    packages.toArray();
  };

  public shared ({ caller }) func updateCurrencyMapping() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update currency mapping");
    };
    currencyMapping.add("USA", "USD");
    currencyMapping.add("India", "INR");
    currencyMapping.add("UK", "GBP");
    currencyMapping.add("UAE", "AED");
    currencyMapping.add("Singapore", "SGD");
    currencyMapping.add("Europe", "EUR");
  };
};
