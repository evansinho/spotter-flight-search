# Flight Search Engine ✈️

A modern, full-featured flight search application built with Next.js 15, TypeScript, and the Amadeus API. Search, compare, and filter flight options with an intuitive interface featuring real-time data visualization.

🔗 **Live Demo**: [https://spotter-flight-search.vercel.app](https://spotter-flight-search.vercel.app)

## Features

### Core Functionality
- **Real-time Flight Search**: Search flights between any two airports with flexible date selection
- **Smart Airport Autocomplete**: Fast, debounced search with location details
- **Advanced Filtering System**:
  - Filter by number of stops (non-stop, 1 stop, 2+ stops)
  - Dynamic price range slider
  - Maximum duration filter
  - Filter by specific airlines
- **Multiple Sorting Options**: Sort by price or duration (ascending/descending)
- **Interactive Price Graph**: Visual price distribution with color-coded affordability indicators

### User Experience
- **Dark Mode**: Seamless light/dark theme switching with persistence
- **Recent Searches**: Quick access to your last 5 searches
- **Share Search**: Generate and copy shareable URLs for specific flight searches
- **Responsive Design**: Fully optimized for mobile (320px+), tablet, and desktop
- **Mobile Filter Drawer**: Bottom sheet interface for filters on mobile devices
- **Expandable Flight Details**: View detailed segment information, layovers, and aircraft types

### Performance
- **Code Splitting**: Dynamic imports for heavy components (Recharts)
- **React Memoization**: Optimized re-renders for FlightCard, FilterPanel, and PriceGraph
- **Efficient Filtering**: Debounced search and optimized filter operations
- **Fast Loading**: Static page generation with server-side API routes

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with dark mode support
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization for price graphs
- **date-fns** - Date manipulation and formatting
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Amadeus Travel API** - Real-time flight data
- **Axios** - HTTP client with interceptors for authentication

### Deployment
- **Vercel** - Hosting and deployment platform
- **GitHub** - Version control

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Amadeus API credentials (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/evansinho/spotter-flight-search.git
cd spotter-flight-search
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Amadeus API Credentials (Test Environment)
# Get your credentials at: https://developers.amadeus.com/
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
AMADEUS_API_URL=https://test.api.amadeus.com
```

To get your Amadeus API credentials:
1. Sign up at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a new app in your dashboard
3. Copy your API Key and API Secret

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
spotter-flight-search/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── airports/      # Airport search endpoint
│   │   │   └── flights/       # Flight search endpoint
│   │   ├── globals.css        # Global styles and Tailwind config
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Home page
├── components/                 # React components
│   ├── FlightSearch.tsx       # Search form
│   ├── FlightResults.tsx      # Results container
│   ├── FlightCard.tsx         # Individual flight display
│   ├── FilterPanel.tsx        # Desktop filter sidebar
│   ├── MobileFilterDrawer.tsx # Mobile filter drawer
│   ├── PriceGraph.tsx         # Price visualization
│   ├── DarkModeToggle.tsx     # Theme switcher
│   ├── RecentSearches.tsx     # Recent search history
│   └── ShareSearchButton.tsx  # Share functionality
├── hooks/                      # Custom React hooks
│   ├── useFlightSearch.ts     # Flight search with React Query
│   ├── useFlightFilters.ts    # Filter state management
│   └── useRecentSearches.ts   # Recent searches with localStorage
├── lib/                        # Utilities and services
│   ├── api/
│   │   └── amadeus-server.ts  # Amadeus API client
│   └── filters/
│       └── flightFilters.ts   # Filter logic
├── types/                      # TypeScript type definitions
│   └── flight.ts              # Flight data types
└── public/                     # Static assets
```

## API Endpoints

### GET /api/airports
Search for airports by keyword.

**Query Parameters:**
- `keyword` (string, required): Search term (minimum 2 characters)

**Response:**
```json
{
  "data": [
    {
      "iataCode": "LHR",
      "name": "HEATHROW",
      "city": "LONDON",
      "country": "UNITED KINGDOM",
      "type": "AIRPORT"
    }
  ]
}
```

### GET /api/flights
Search for flights between airports.

**Query Parameters:**
- `originLocationCode` (string, required): Origin airport IATA code
- `destinationLocationCode` (string, required): Destination airport IATA code
- `departureDate` (string, required): Departure date (YYYY-MM-DD)
- `returnDate` (string, optional): Return date for round trips
- `adults` (number, required): Number of adult passengers
- `children` (number, optional): Number of child passengers
- `travelClass` (string, optional): ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
- `max` (number, optional): Maximum number of results (default: 50)

**Response:**
```json
{
  "data": [...],
  "dictionaries": {
    "carriers": {...},
    "aircraft": {...}
  }
}
```

## Key Features Implementation

### Filter System
The application uses a sophisticated filtering system with real-time updates:
- **Dynamic Price Range**: Automatically adjusts to available flight prices
- **Stop Filters**: Shows count of flights for each stop category
- **Airline Filters**: Displays top 10 airlines with flight counts
- **Duration Filter**: Slider with 30-minute increments

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders of expensive components
- **Dynamic Imports**: Recharts loaded only when needed (reduces initial bundle by ~100KB)
- **Debounced Search**: Airport search waits 300ms before API calls
- **Efficient State Management**: Minimal re-renders with proper state structure

### Responsive Design
- **Mobile-First**: Designed for 320px minimum width
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Targets**: All interactive elements meet 44x44px minimum
- **Adaptive Layout**: Filter sidebar on desktop, drawer on mobile

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AMADEUS_API_KEY` | Amadeus API client ID | Yes |
| `AMADEUS_API_SECRET` | Amadeus API client secret | Yes |
| `AMADEUS_API_URL` | Amadeus API base URL | Yes |

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in project settings

3. **Configure Environment Variables**
   - Navigate to Project Settings → Environment Variables
   - Add all three required variables for Production and Preview environments

The application will automatically deploy on every push to main.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Bundle Size**: ~200KB (initial load)

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Quality
- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Consistent code formatting

## Known Limitations

- **Test API**: Using Amadeus test environment (limited data)
- **Rate Limits**: Free tier has API call restrictions
- **Search Results**: Maximum 50 flights per search
- **Date Range**: Limited to future dates only

## Future Enhancements

- [ ] Multi-city search support
- [ ] Price alerts and notifications
- [ ] User authentication and saved searches
- [ ] Booking integration
- [ ] Price history tracking
- [ ] Flight status tracking
- [ ] Trip planning features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is built as part of a technical assessment and is available for educational purposes.

## Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com/) - Flight data API
- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## Contact

Built by Evansinho - [GitHub](https://github.com/evansinho)

---

**Note**: This application uses the Amadeus Test API. For production use, upgrade to a production API key and implement proper error handling, rate limiting, and caching strategies.