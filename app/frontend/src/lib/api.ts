import PocketBase from "pocketbase";

const API_URL = import.meta.env.VITE_API_URL;
const pb = new PocketBase(API_URL);
pb.autoCancellation(false);

/**
 * Ensures the user is authenticated with a valid auth token.
 * If the token isn't valid, it saves a new one in PocketBase's auth store.
 */
export const ensureAuth = (authToken: string): void => {
  if (!authToken) {
    throw new Error("❌ Authentication token is required.");
  }

  if (!pb.authStore.isValid || pb.authStore.token !== authToken) {
    pb.authStore.save(authToken, null);
  }
};

// **🛠 Authentication Utility Functions**
export const AuthAPI = {
  login: async (email: string, password: string) => {
    try {
      const authData = await pb.collection("users").authWithPassword(email, password);
      
      // ✅ Store token using `ensureAuth()`
      ensureAuth(authData.token);

      // ✅ Only log in development mode
      if (import.meta.env.DEV) {
        console.log("✅ Login Successful:", authData);
      }

      return { success: true, token: authData.token, userId: authData.record.id };
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      return { success: false, message: error.message || "Invalid email or password" };
    }
  },

  logout: () => {
    pb.authStore.clear();

    // Ensure token is FULLY cleared
    localStorage.removeItem("pocketbase_auth");
    sessionStorage.removeItem("pocketbase_auth");

    window.location.href = "/signin";
    console.log("Logged out successfully!");
  },

  isAuthenticated: () => {
    return !!pb.authStore.isValid && !!pb.authStore.record;
  },

  getUser: () => {
    return pb.authStore.record || null;
  },
};

// **🛠 Trip Utility Functions**
export const TripAPI = {
  // ✅ Fetch All Trips
  getTrips: async () => {
    try {
      const trips = await pb.collection("trips").getList();
      
      // ✅ Only log in dev mode
      if (import.meta.env.DEV) {
        console.log("📜 Retrieved Trips:", trips.items);
      }

      return trips.items;
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
      throw error;
    }
  },

  // ✅ Create New Trip
  createTrip: async (tripData: any) => {
    try {
      const newTrip = await pb.collection("trips").create(tripData);
      
      // ✅ Only log in dev mode
      if (import.meta.env.DEV) {
        console.log("🆕 Trip Created:", newTrip);
      }

      return newTrip;
    } catch (error) {
      console.error("❌ Error creating trip:", error);
      throw error;
    }
  },

  // ✅ Fetch Single Trip
  getTripById: async (tripId: string) => {
    try {
      const trip = await pb.collection("trips").getOne(tripId);

      // ✅ Only log in dev mode
      if (import.meta.env.DEV) {
        console.log("📜 Retrieved Trip:", trip);
      }

      return trip;
    } catch (error) {
      console.error("❌ Error fetching trip:", error);
      throw error;
    }
  },
};

export default pb;
