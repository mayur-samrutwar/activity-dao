import React, { forwardRef, useImperativeHandle, Ref } from 'react';
import type { NextPage } from "next";
import { css } from "@emotion/css";
import staticEvents from "../data/events.json";
import { format, parseISO, isAfter, isBefore, isToday, isThisWeek, isThisMonth, isThisYear, startOfQuarter, endOfQuarter, endOfYear, addYears } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import Component1 from "./featured-events";
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  OutlinedInput,
  FormControl,
  IconButton
} from "@mui/material";
import dynamic from 'next/dynamic';
import { Event, EventLocation } from '../types/event'; // Add this import
import interests from '../data/interests.json';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

// Add this type definition

// Add these custom icon components
const ViewListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
  </svg>
);

const ViewModuleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
  </svg>
);

export type EventsListType = {
  className?: string;
};

interface EventsListProps {
  mode: 'explore' | 'home';
  className?: string;
  hideHeader?: boolean;
  hideDescription?: boolean;
  daoMode?: string;
  interestMode?: string;
  eventsPerPage?: number;
}

const EventCard = ({ event }: { event: Event }) => {
  const eventDate = parseISO(event.date);
  const day = format(eventDate, "dd");
  const month = format(eventDate, "MMM").toUpperCase();

  return (
    <div
      id="event-query"
      className={css`
        flex: 1 0 100%;
        height: 22.875rem;
        border-radius: var(--br-3xl);
        background-color: var(--border-default-default);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        transition: box-shadow 0.3s ease;
        &:hover {
          box-shadow: 0 0 0 3px var(--color-gold-100);
        }
        @media screen and (min-width: 769px) {
          flex: 0 0 calc(50% - 0.5rem);
        }
        @media screen and (min-width: 1051px) {
          flex: 0 0 calc(33.33% - 0.67rem);
        }
        position: relative;
      `}
    >
      {event.isFeatured && (
        <div className={css`
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: var(--color-gold-100);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 1;
        `}>
          ⭐ Featured
        </div>
      )}
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className={css`
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <div
          className={css`
            flex: 1;
            background-image: url(${event.image});
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: var(--padding-xl);
          `}
        >
          <div
            className={css`
              align-self: flex-end;
              background-color: var(--background-default-default);
              border-radius: var(--br-8xs);
              padding: var(--padding-8xs) var(--padding-4xs);
              text-align: center;
              width: 3.5rem;
              height: 3.5rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            `}
          >
            <b className={css`font-size: var(--font-size-9xl-4);`}>{day}</b>
            <b
              className={css`
                font-size: var(--font-size-xs-4);
                color: var(--color-mediumblue);
                font-family: var(--font-dm-sans);
              `}
            >
              {month}
            </b>
          </div>
          <div
            className={css`
              background-color: var(--background-default-default);
              border-radius: var(--br-3xs);
              padding: var(--padding-3xs-5) var(--padding-xs);
              font-family: var(--font-dynapuff);
            `}
          >
            <b className={css`
              font-size: var(--font-size-xl);
              text-align: left;
              display: block;
            `}>{event.name}</b>
            <div
              className={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: var(--gap-6xs);
                font-size: var(--font-size-base);
                color: var(--color-azure-47);
                font-family: var(--font-hanken-grotesk);
              `}
            >
              <div className={css`font-weight: 600;`}>{event.location}</div>
              {/* <div
                className={css`
                  background-color: var(--color-lemonchiffon);
                  color: var(--color-gold-100);
                  border-radius: var(--br-7xs);
                  padding: var(--padding-6xs-5) var(--padding-6xs);
                  font-weight: 600;
                `}
              >
                All Day
              </div> */}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const ListEventCard = ({ event }: { event: Event }) => {
  const eventDate = parseISO(event.date);
  const day = format(eventDate, "dd");
  const month = format(eventDate, "MMM").toUpperCase();

  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className={css`
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-default-default);
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.3s ease;
        width: 100%;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          box-shadow: 0 0 0 3px var(--color-gold-100);
        }
        position: relative;
      `}
    >
      {event.isFeatured && (
        <div className={css`
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: var(--color-gold-100);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 1;
        `}>
          ⭐ Featured
        </div>
      )}
      <img
        src={event.image}
        alt={event.name}
        className={css`
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--br-3xs);
          margin-right: 1rem;
        `}
      />
      <div
        className={css`
          flex: 1;
        `}
      >
        <h3
          className={css`
            margin: 0;
            font-size: var(--font-size-xl);
          `}
        >
          {event.name}
        </h3>
        <p
          className={css`
            margin: 0.25rem 0 0;
            color: var(--color-azure-47);
            font-size: 0.8rem;
            font-weight: 400;
          `}
        >
          {event.location}
        </p>
      </div>
      <div
        className={css`
          background-color: var(--background-default-default);
          border-radius: var(--br-8xs);
          padding: var(--padding-8xs) var(--padding-4xs);
          text-align: center;
          width: 3.5rem;
          height: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid #000;
        `}
      >
        <b className={css`font-size: var(--font-size-9xl-4);`}>{day}</b>
        <b
          className={css`
            font-size: var(--font-size-xs-4);
            color: var(--color-mediumblue);
            font-family: var(--font-dm-sans);
          `}
        >
          {month}
        </b>
      </div>
    </a>
  );
};

// Add these functions at the top of your file
function checkDaoSimilarity(event: Event, mode: string): boolean {
  if (!mode) return true;
  const fields = [event.dao, event.name, event.description];
  return fields.some(field => 
    stringSimilarity(field.toLowerCase(), mode.toLowerCase()) >= 0.9
  );
}

function checkInterestSimilarity(event: Event, mode: string): boolean {
  if (!mode) return true;
  const fields = [event.dao, event.name, event.description];
  const modeWords = mode.toLowerCase().split(/\s+/);
  return fields.some(field => {
    const fieldWords = field.toLowerCase().split(/\s+/);
    return modeWords.some(modeWord => 
      fieldWords.some(fieldWord => 
        stringSimilarity(modeWord, fieldWord) >= 0.8
      )
    );
  });
}

// Add this function near the top of your file, alongside other utility functions
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}

// Define the GraphQL client
const endpoint = 'https://graph.sola.day/v1/graphql';

async function fetchUpcomingEvents(): Promise<Event[]> {
  const currentTime = new Date().toISOString();
  const oneYearLater = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

  const query = `
    query FetchUpcomingEvents($currentTime: timestamp!, $oneYearLater: timestamp!) {
      events(
        where: {
          display: {_neq: "private"},
          start_time: {_gte: $currentTime, _lte: $oneYearLater},
          status: {_in: ["open", "new", "normal"]}
        },
        order_by: {start_time: asc},
        limit: 100
      ) {
        id
        title
        start_time
        end_time
        location
        participants_count
        cover_url
        owner {
          username
          image_url
        }
      }
    }
  `;

  const variables = {
    currentTime: currentTime.split('.')[0] + 'Z',
    oneYearLater: oneYearLater.split('.')[0] + 'Z'
  };

  try {
    console.log("Fetching events...");
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Original API response:", JSON.stringify(data, null, 2));
    
    if (!data.data || !data.data.events || data.data.events.length === 0) {
      console.log("No events received from API");
      return [];
    }

    const filteredEvents = data.data.events.filter((event: any) => {
      const eventText = `${event.title} ${event.description || ''} ${event.owner?.username || ''}`.toLowerCase();
      const eventWords = eventText.split(/\s+/);
      
      for (const interest of interests) {
        const interestWords = interest.id_slug.toLowerCase().split(/\s+/);
        for (const interestWord of interestWords) {
          for (const eventWord of eventWords) {
            const similarity = stringSimilarity(eventWord, interestWord);
            if (similarity >= 0.7) {
              console.log(`Event "${event.title}" matched:
                Interest: ${interest.id_slug}
                Matched words: "${eventWord}" ~ "${interestWord}"
                Similarity: ${similarity.toFixed(2)}
              `);
              return true;
            }
          }
        }
      }
      return false;
    });

    console.log(`Filtered ${filteredEvents.length} events out of ${data.data.events.length} total events`);

    const mappedEvents = filteredEvents.map((event: any) => ({
      date: event.start_time,
      name: event.title,
      location: event.location || 'Location not specified',
      link: `https://app.sola.day/event/detail/${event.id}`,
      image: event.cover_url || 'https://pbs.twimg.com/profile_banners/1635444352959885313/1729576236/1500x500',
      dao: event.owner?.username || 'Unknown',
      description: `Event by ${event.owner?.username || 'Unknown'}`,
      id: event.id,
    }));

    console.log("Mapped and filtered events:", mappedEvents);
    return mappedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

const EventsList = forwardRef<EventsListReturnType, EventsListProps>((props, ref) => {
  const { 
    mode, 
    className = '', 
    hideHeader = false, 
    hideDescription = false, 
    daoMode,
    interestMode,
    eventsPerPage = 9 // Default to 9 events per page
  } = props;

  console.log("EventsList rendered with mode:", mode);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<EventLocation | null>(null);
  const [timeFilter, setTimeFilter] = useState("upcoming");
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [hasMatchingEvents, setHasMatchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    location: null as EventLocation | null,
    time: "upcoming"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    hasMatchingEvents
  }));

  useEffect(() => {
    console.log("useEffect triggered. Setting viewMode based on mode:", mode);
    setViewMode(mode === 'explore' ? 'list' : 'gallery');
  }, [mode]);

  useEffect(() => {
    console.log("Current viewMode:", viewMode);
  }, [viewMode]);

  useEffect(() => {
    console.log("Fetching events...");
    setIsLoading(true);
    setError(null);
    fetchUpcomingEvents().then(fetchedEvents => {
      console.log("Fetched events:", fetchedEvents);
      if (fetchedEvents.length === 0) {
        console.log("No events fetched");
      }
      // Combine fetched events with static events, marking static events as featured
      const combinedEvents = [
        ...staticEvents.map(event => ({ ...event, isFeatured: true })),
        ...fetchedEvents
      ];
      setEvents(combinedEvents);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      setIsLoading(false);
    });
  }, []);

  const filteredEvents = useMemo(() => {
    console.log("Filtering events with:", { searchTerm, selectedLocation, daoMode, interestMode });
    
    const filtered = events
      .filter((event: Event) => {
        const daoMatch = !daoMode || checkDaoSimilarity(event, daoMode);
        const interestMatch = !interestMode || checkInterestSimilarity(event, interestMode);
        
        if (!daoMatch || !interestMatch) return false;

        // Apply search filter
        const searchMatch = 
          (event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        // Apply location filter
        const locationMatch = selectedLocation === null || event.location === selectedLocation.city;

        return searchMatch && locationMatch;
      });

    // Separate featured and non-featured events
    const featuredEvents = filtered.filter(event => event.isFeatured);
    const nonFeaturedEvents = filtered.filter(event => !event.isFeatured);

    // Sort only non-featured events
    nonFeaturedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Combine featured events (unsorted) with sorted non-featured events
    return [...featuredEvents, ...nonFeaturedEvents];
  }, [events, searchTerm, selectedLocation, daoMode, interestMode]);

  const getCounts = useMemo(() => {
    const now = new Date();
    const counts = {
      all: filteredEvents.length,
      upcoming: 0,
      past: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisQuarter: 0,
      thisYear: 0,
      nextYear: 0
    };

    filteredEvents.forEach(event => {
      const eventDate = parseISO(event.date);
      if (isAfter(eventDate, now) || isToday(eventDate)) counts.upcoming++;
      if (isBefore(eventDate, now)) counts.past++;
      if (isToday(eventDate)) counts.today++;
      if (isThisWeek(eventDate)) counts.thisWeek++;
      if (isThisMonth(eventDate)) counts.thisMonth++;
      if (isAfter(eventDate, startOfQuarter(now)) && isBefore(eventDate, endOfQuarter(now))) counts.thisQuarter++;
      if (isThisYear(eventDate)) counts.thisYear++;
      if (isAfter(eventDate, endOfYear(now)) && isBefore(eventDate, endOfYear(addYears(now, 1)))) counts.nextYear++;
    });

    return counts;
  }, [filteredEvents]);

  const timeFilteredEvents = useMemo(() => {
    return filteredEvents.filter((event: Event) => {
      const eventDate = parseISO(event.date);
      const now = new Date();

      switch (timeFilter) {
        case 'upcoming':
          return isAfter(eventDate, now) || isToday(eventDate);
        case 'past':
          return isBefore(eventDate, now);
        case 'today':
          return isToday(eventDate);
        case 'thisWeek':
          return isThisWeek(eventDate);
        case 'thisMonth':
          return isThisMonth(eventDate);
        case 'thisQuarter':
          return isAfter(eventDate, startOfQuarter(now)) && isBefore(eventDate, endOfQuarter(now));
        case 'thisYear':
          return isThisYear(eventDate);
        case 'nextYear':
          return isAfter(eventDate, endOfYear(now)) && isBefore(eventDate, endOfYear(addYears(now, 1)));
        case 'all':
        default:
          return true;
      }
    });
  }, [filteredEvents, timeFilter]);

  useEffect(() => {
    setHasMatchingEvents(timeFilteredEvents.length > 0);
  }, [timeFilteredEvents]);

  const locations = useMemo(() => {
    const filteredLocations = filteredEvents.map(event => event.location);
    return Array.from(new Set(filteredLocations)).sort();
  }, [filteredEvents]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return timeFilteredEvents.slice(startIndex, endIndex);
  }, [timeFilteredEvents, currentPage, eventsPerPage]);

  const totalPages = Math.ceil(timeFilteredEvents.length / eventsPerPage);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: EventLocation } = {};
    timeFilteredEvents.forEach(event => {
      if (!groups[event.location]) {
        groups[event.location] = {
          city: event.location,
          lat: 0, // You'll need to add latitude data to your events
          lng: 0, // You'll need to add longitude data to your events
          events: []
        };
      }
      groups[event.location].events.push(event);
    });
    return Object.values(groups);
  }, [timeFilteredEvents]);

  const clearFilters = () => {
    setFilters({
      search: "",
      location: null,
      time: "upcoming"
    });
    setSearchTerm("");
    setSelectedLocation(null);
    setTimeFilter("upcoming");
  };

  return (
    <div className={css`
      width: 100%;
      max-width: 100%;
    `}>
      {!hideHeader && (
        <div id="events"
          className={[
            css`
              align-self: stretch;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              gap: var(--gap-3xs);
              text-align: center;
              font-size: var(--font-size-21xl);
              color: var(--wwwgetminjiapp-black);
              font-family: var(--font-dynapuff);
              width: 100%;
            `,
            className,
          ].join(" ")}
        >
          {mode === 'home' && (
            <div
              className={css`
                align-self: stretch;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 0rem var(--padding-512xl);
                width: 100%;
              `}
            >
              <Component1 developmentIcon="FEATURED EVENTS" />
            </div>
          )}
          <h1
            className={css`
              margin: 0;
              align-self: stretch;
              position: relative;
              font-size: inherit;
              line-height: 3.844rem;
              font-weight: 600;
              font-family: inherit;
              width: 100%;
              @media screen and (max-width: 1050px) {
                font-size: var(--font-size-13xl);
                line-height: 3.063rem;
              }
              @media screen and (max-width: 450px) {
                font-size: var(--font-size-5xl);
                line-height: 2.313rem;
              }
            `}
          >
            Find an Event 🎉
          </h1>
          {!hideDescription && (
            <h3
              className={css`
                margin: 0;
                align-self: stretch;
                position: relative;
                font-size: var(--font-size-5xl);
                line-height: 2.469rem;
                font-weight: 400;
                font-family: var(--font-hanken-grotesk);
                @media screen and (max-width: 450px) {
                  font-size: var(--font-size-lgi);
                  line-height: 2rem;
                }
              `}
            >
              Check out upcoming activity based events!
            </h3>
          )}
        </div>
      )}

      <div className={css`
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
        padding: ${mode === "explore" ? "2rem" : "1rem"};
      `} id="events-list">
        <div className={css`
          display: flex;
          flex-direction: row;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          width: 100%;
          @media (max-width: 768px) {
            flex-wrap: wrap;
          }
        `}>
          <TextField
            style={{ flex: '1 1 auto' }}
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilters(prev => ({ ...prev, search: e.target.value }));
            }}
            InputProps={{
              startAdornment: (
                <img
                  width="16px"
                  height="16px"
                  src="/search.svg"
                  style={{ marginRight: "8px" }}
                />
              ),
            }}
          />
          <div className={css`
            display: flex;
            gap: 1rem;
            flex: 0 0 auto;
            @media (max-width: 768px) {
              width: 100%;
            }
          `}>
            <FormControl style={{ width: '150px' }}> 
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedLocation?.city || ''}
                onChange={(e) => {
                  const newLocation = locations.find(location => location === e.target.value)
                    ? { city: e.target.value, lat: 0, lng: 0, events: [] }
                    : null;
                  setSelectedLocation(newLocation);
                  setFilters(prev => ({ ...prev, location: newLocation }));
                }}
                input={<OutlinedInput label="Location" />}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: '150px' }}>
              <InputLabel>Time</InputLabel>
              <Select
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value as string);
                  setFilters(prev => ({ ...prev, time: e.target.value as string }));
                }}
                input={<OutlinedInput label="Time" />}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                <MenuItem value="upcoming">Upcoming Events ({getCounts.upcoming})</MenuItem>
                <MenuItem value="all">All Events ({getCounts.all})</MenuItem>
                <MenuItem value="past">Past Events ({getCounts.past})</MenuItem>
                {Object.entries(getCounts).map(([key, count]) => (
                  count > 0 && key !== 'upcoming' && key !== 'all' && key !== 'past' && (
                    <MenuItem key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                    </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setViewMode('gallery')}>
              <ViewModuleIcon />
            </IconButton>
            <IconButton onClick={() => setViewMode('list')}>
              <ViewListIcon />
            </IconButton>
          </div>
        </div>
        {isLoading ? (
          <div>Loading events...</div>
        ) : error ? (
          <div>{error}</div>
        ) : hasMatchingEvents ? (
          <div className={css`
            width: 100%;
            max-width: 100%;
            padding-top: 2rem;
          `}>
            {viewMode === 'gallery' ? (
              <div className={css`
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: flex-start;
                width: 100%;
              `}>
                {paginatedEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            ) : (
              <div className={css`
                display: flex;
                flex-direction: column;
                width: 100%;
              `}>
                {paginatedEvents.map((event, index) => (
                  <ListEventCard key={index} event={event} />
                ))}
              </div>
            )}
            
            {/* Pagination controls */}
            <div className={css`
              display: flex;
              justify-content: center;
              margin-top: 2rem;
            `}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={css`margin: 0 1rem;`}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <h3 className={css`
            text-align: center;
            width: 100%;
            margin-top: 2rem;
            color: var(--color-gray-500);
          `}>
            {daoMode || interestMode 
              ? `No events found for ${daoMode || interestMode}`
              : "No events found"}
          </h3>
        )}
      </div>
    </div>
  );
});

const EventsListComponent = EventsList as typeof EventsList & {
  checkForEvents: (daoName: string) => Promise<boolean>;
};

EventsListComponent.checkForEvents = async (daoName: string): Promise<boolean> => {
  const fetchedEvents = await fetchUpcomingEvents();
  const allEvents = [...fetchedEvents, ...staticEvents];
  
  return allEvents.some(event => 
    checkDaoSimilarity(event, daoName) || checkInterestSimilarity(event, daoName)
  );
};

// Add this to the return type of the component
export type EventsListReturnType = {
  hasMatchingEvents: boolean;
};

export default EventsListComponent;
