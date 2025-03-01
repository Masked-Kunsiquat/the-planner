import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

// Define Activity Type
export type ActivityPayload = {
  name: string;
  description?: string;
  category: string;
  rating?: number;
  notes?: string;
  location_id?: string;
  address_id?: string;
};

// Create a new activity
export async function createActivity(data: ActivityPayload) {
  try {
    return await pb.collection("activities").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create activity.");
  }
}

// Fetch all activities
export async function getAllActivities() {
  try {
    return await pb.collection("activities").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch activities.");
  }
}

// Fetch a single activity by ID
export async function getActivityById(id: string) {
  try {
    return await pb.collection("activities").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Activity with ID ${id} not found.`);
  }
}

// Update an activity
export async function updateActivity(id: string, updates: Partial<ActivityPayload>) {
  try {
    return await pb.collection("activities").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update activity ${id}.`);
  }
}

// Delete an activity
export async function deleteActivity(id: string) {
  try {
    return await pb.collection("activities").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete activity ${id}.`);
  }
}
