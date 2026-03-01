# Specification

## Summary
**Goal:** Add admin panel with analytics tracking, support Indian domestic routes with realistic pricing, and enhance Sarah AI chatbot with intelligent rule-based responses and upgrade functionality.

**Planned changes:**
- Add Admin Panel button in header navigation linking to /admin route with username/password authentication
- Store comprehensive user interaction data in backend: user details, package details, satisfaction metrics (before/after Sarah), AI usage, booking status, and timestamps
- Display all analytics data in Admin Panel dashboard with ability to compare satisfaction rates with and without Sarah AI
- Add 10 Indian domestic airports (Mumbai, Bangalore, Hyderabad, Delhi, Chennai, Goa, Vijayawada, Kolkata, Pune, Ahmedabad) with realistic INR pricing (flights ₹3,000-₹9,000, hotels ₹2,000-₹12,000/night)
- Fix Upgrade Package button in Sarah chatbot to add 2-3 amenities without changing price
- Implement rule-based intelligent responses in Sarah using keyword detection (beach activity, romantic experience, adventure, local experience) to suggest contextual improvements
- Allow users to type custom requests in Sarah chat interface
- Adjust satisfaction popup timing: first popup after ~8 seconds, second popup after Sarah completes improvements
- Track Sarah AI engagement when user opens chatbot
- Track booking conversions when user proceeds to booking confirmation

**User-visible outcome:** Users can search Indian domestic routes with accurate pricing, interact with an intelligent Sarah chatbot that understands requests and suggests package improvements, and administrators can access a protected admin panel to view comprehensive analytics on user satisfaction, AI engagement, and booking conversions.
