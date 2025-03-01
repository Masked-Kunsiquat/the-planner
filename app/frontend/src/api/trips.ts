import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler";

// Define the trip data type
export type TripPayload = {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  owner_id: string;
  participants?: string[];
};

// Create a new trip
export async function createTrip(data: TripPayload): Promise<TripPayload> {
  try {
    return await pb.collection("trips").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create trip.");
  }
}

// Fetch all trips
export async function getAllTrips(): Promise<TripPayload[]> {
  try {
    return await pb.collection("trips").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch trips.");
  }
}

// Fetch a single trip by ID
export async function getTripById(id: string): Promise<TripPayload> {
  try {
    return await pb.collection("trips").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Trip with ID ${id} not found.`);
  }
}

// Update a trip
export async function updateTrip(id: string, updates: Partial<TripPayload>): Promise<TripPayload> {
  try {
    return await pb.collection("trips").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update trip ${id}.`);
  }
}

// Delete a trip
export async function deleteTrip(id: string): Promise<void> {
  try {
    await pb.collection("trips").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete trip ${id}.`);
  }
}
