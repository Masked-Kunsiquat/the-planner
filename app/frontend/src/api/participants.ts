import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

export type ParticipantPayload = {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
};

// Create a new participant
export async function createParticipant(data: ParticipantPayload) {
  try {
    return await pb.collection("participants").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create participant.");
  }
}

// Fetch all participants
export async function getAllParticipants() {
  try {
    return await pb.collection("participants").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch participants.");
  }
}

// Fetch a single participant by ID
export async function getParticipantById(id: string) {
  try {
    return await pb.collection("participants").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Participant with ID ${id} not found.`);
  }
}

// Update a participant
export async function updateParticipant(id: string, updates: Partial<ParticipantPayload>) {
  try {
    return await pb.collection("participants").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update participant ${id}.`);
  }
}

// Delete a participant
export async function deleteParticipant(id: string) {
  try {
    return await pb.collection("participants").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete participant ${id}.`);
  }
}
