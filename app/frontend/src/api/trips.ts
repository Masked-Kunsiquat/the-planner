import pb from "./pocketbase";

export const getTrips = async () => pb.collection("trips").getFullList();

export const createTrip = async (data: any) => pb.collection("trips").create(data);

export const updateTrip = async (id: string, data: any) => pb.collection("trips").update(id, data);

export const deleteTrip = async (id: string) => pb.collection("trips").delete(id);