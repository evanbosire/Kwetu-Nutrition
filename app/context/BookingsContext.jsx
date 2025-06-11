
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings from storage on initial render
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const savedBookings = await AsyncStorage.getItem('@bookings');
        if (savedBookings !== null) {
          setBookings(JSON.parse(savedBookings));
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Save bookings to storage whenever they change
  useEffect(() => {
    const saveBookings = async () => {
      if (!isLoading) { // Don't save on initial load
        try {
          await AsyncStorage.setItem('@bookings', JSON.stringify(bookings));
        } catch (error) {
          console.error('Failed to save bookings:', error);
        }
      }
    };

    saveBookings();
  }, [bookings, isLoading]);

  const addToBookings = (service) => {
    const newBooking = {
      ...service,
      id: `${service.id}-${Date.now()}`, // Add unique ID
      bookingDate: new Date().toISOString()
    };
    
    setBookings(prev => {
      const updatedBookings = [...prev, newBooking];
      return updatedBookings;
    });
  };

  const removeFromBookings = (bookingId) => {
    setBookings(prev => {
      const updatedBookings = prev.filter(item => item.id !== bookingId);
      return updatedBookings;
    });
  };

  const clearAllBookings = async () => {
    try {
      setBookings([]);
      await AsyncStorage.removeItem('@bookings');
    } catch (error) {
      console.error('Failed to clear bookings:', error);
    }
  };

  return (
    <BookingsContext.Provider 
      value={{ 
        bookings, 
        addToBookings, 
        removeFromBookings, 
        clearAllBookings,
        isLoading 
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};
// Add this at the end of your file
export default () => null;
