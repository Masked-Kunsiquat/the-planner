import pb from "./pocketbase";
import { handleApiError } from "../utils/errorHandler"; // Import error handler

export type AddressPayload = {
  street: string;
  city: string;
  state?: string;
  country: string;
  zip?: string;
};

// Create a new address
export async function createAddress(data: AddressPayload) {
  try {
    return await pb.collection("addresses").create(data);
  } catch (error) {
    throw handleApiError(error, "Failed to create address.");
  }
}

// Fetch all addresses
export async function getAllAddresses() {
  try {
    return await pb.collection("addresses").getFullList();
  } catch (error) {
    throw handleApiError(error, "Failed to fetch addresses.");
  }
}

// Fetch a single address by ID
export async function getAddressById(id: string) {
  try {
    return await pb.collection("addresses").getOne(id);
  } catch (error) {
    throw handleApiError(error, `Address with ID ${id} not found.`);
  }
}

// Update an address
export async function updateAddress(id: string, updates: Partial<AddressPayload>) {
  try {
    return await pb.collection("addresses").update(id, updates);
  } catch (error) {
    throw handleApiError(error, `Failed to update address ${id}.`);
  }
}

// Delete an address
export async function deleteAddress(id: string) {
  try {
    return await pb.collection("addresses").delete(id);
  } catch (error) {
    throw handleApiError(error, `Failed to delete address ${id}.`);
  }
}
