import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

export type LodgingPayload = {
  trip_id: string;
  type: string;
  name: string;
  address_id: string;
  check_in_date: string;
  check_out_date: string;
  notes?: string;
};

// Create a new lodging
export async function createLodging(data: LodgingPayload) {
  try {
    return await pb.collection("lodging").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create lodging.");
  }
}

// Fetch all lodging
export async function getAllLodging() {
  try {
    return await pb.collection("lodging").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch lodging.");
  }
}

// Fetch a single lodging by ID
export async function getLodgingById(id: string) {
  try {
    return await pb.collection("lodging").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Lodging with ID ${id} not found.`);
  }
}

// Update a lodging
export async function updateLodging(id: string, updates: Partial<LodgingPayload>) {
  try {
    return await pb.collection("lodging").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update lodging ${id}.`);
  }
}

// Delete a lodging
export async function deleteLodging(id: string) {
  try {
    return await pb.collection("lodging").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete lodging ${id}.`);
  }
}
