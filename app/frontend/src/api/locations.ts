import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

export type LocationPayload = {
  city: string;
  state?: string;
  country: string;
  timezone?: string;
  airport_code?: string;
};

// Create a new location
export async function createLocation(data: LocationPayload) {
  try {
    return await pb.collection("locations").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create location.");
  }
}

// Fetch all locations
export async function getAllLocations() {
  try {
    return await pb.collection("locations").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch locations.");
  }
}

// Fetch a single location by ID
export async function getLocationById(id: string) {
  try {
    return await pb.collection("locations").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Location with ID ${id} not found.`);
  }
}

// Update a location
export async function updateLocation(id: string, updates: Partial<LocationPayload>) {
  try {
    return await pb.collection("locations").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update location ${id}.`);
  }
}

// Delete a location
export async function deleteLocation(id: string) {
  try {
    return await pb.collection("locations").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete location ${id}.`);
  }
}
