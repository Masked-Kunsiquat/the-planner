import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

export type TransportationPayload = {
  trip_id: string;
  type: string;
  departure_time: string;
  arrival_time: string;
  departure_location?: string;
  arrival_location?: string;
  departure_airport?: string;
  arrival_airport?: string;
  airline_id?: string;
  notes?: string;
};

// Create a new transportation record
export async function createTransportation(data: TransportationPayload) {
  try {
    return await pb.collection("transportation").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create transportation.");
  }
}

// Fetch all transportation records
export async function getAllTransportation() {
  try {
    return await pb.collection("transportation").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch transportation records.");
  }
}

// Fetch a single transportation record by ID
export async function getTransportationById(id: string) {
  try {
    return await pb.collection("transportation").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Transportation with ID ${id} not found.`);
  }
}

// Update a transportation record
export async function updateTransportation(id: string, updates: Partial<TransportationPayload>) {
  try {
    return await pb.collection("transportation").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update transportation ${id}.`);
  }
}

// Delete a transportation record
export async function deleteTransportation(id: string) {
  try {
    return await pb.collection("transportation").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete transportation ${id}.`);
  }
}
