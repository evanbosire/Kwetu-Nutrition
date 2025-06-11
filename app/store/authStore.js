

// import { create } from "zustand";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const useAuthStore = create((set) => ({
//   email: null,
//   token: null,
  
//   setCredentials: async (email, token) => {
//     set({ email, token });
//     await AsyncStorage.setItem('authData', JSON.stringify({ email, token }));
//   },
  
//   clearCredentials: async () => {
//     set({ email: null, token: null });
//     await AsyncStorage.removeItem('authData');
//   },
  
//   // Initialize auth state from storage
//   initializeAuth: async () => {
//     const authData = await AsyncStorage.getItem('authData');
//     if (authData) {
//       const { email, token } = JSON.parse(authData);
//       set({ email, token });
//     }
//   }
// }));

// export default useAuthStore;
import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
  email: null,
  token: null,

  // Main login setter
  setCredentials: async (email, token) => {
    set({ email, token });
    await AsyncStorage.setItem('authData', JSON.stringify({ email, token }));
  },

  // Optional individual setters for compatibility
  setEmail: (email) => set({ email }),
  setToken: (token) => set({ token }),

  // Logout / clear
  clearCredentials: async () => {
    set({ email: null, token: null });
    await AsyncStorage.removeItem('authData');
  },

  // Initialize store from AsyncStorage
  initializeAuth: async () => {
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      const { email, token } = JSON.parse(authData);
      set({ email, token });
    }
  }
}));

export default useAuthStore;
