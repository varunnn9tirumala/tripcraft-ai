import { useState } from "react";

export default function LandingPage() {
  const [destination, setDestination] = useState("");

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-background">
      <div className="max-w-xl w-full text-center space-y-6">

        <h1 className="text-4xl font-bold">
          ✈️ AI Travel Planner
        </h1>

        <p className="text-muted-foreground">
          Plan your perfect trip with Trip Craft.
        </p>

        <input
          type="text"
          placeholder="Where do you want to go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        <button className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90">
          Generate Trip
        </button>

      </div>
    </div>
  );
}