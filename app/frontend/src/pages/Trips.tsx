import { useEffect, useState } from "react";
import { getTrips, createTrip, deleteTrip } from "../api/trips";

const Trips = () => {
    const [trips, setTrips] = useState<any[]>([]);

    useEffect(() => {
        getTrips().then(setTrips);
    }, []);

    const handleDelete = async (id: string) => {
        await deleteTrip(id);
        setTrips(trips.filter((t) => t.id ! == id));
    };

    return (
        <div>
            <h1 className="text-xl font-bold">Trips</h1>
            <button onClick={() => createTrip({ name: "New Trip" })}>Add Trip</button>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        {trip.name}
                        <button onClick={() => handleDelete(trip.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Trips;