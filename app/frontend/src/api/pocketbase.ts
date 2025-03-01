import PocketBase from "pocketbase";

// Initialize PocketBase client
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// Restore authentication session
pb.authStore.loadFromCookie(document.cookie);

// Ensure authentication state is saved to cookies
pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie();
});

// Expose auth object
export const auth = {
  record: pb.authStore.model,
  isAuthenticated: () => pb.authStore.isValid,
  login: async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    return authData;
  },
  logout: () => {
    pb.authStore.clear();
  }
};

export default pb;
