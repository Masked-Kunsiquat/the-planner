// src/components/TripForm.tsx - Fixed version
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Label, TextInput, Textarea, Button, Card } from 'flowbite-react';
import { addTrip } from '../db';

interface TripFormProps {
  onTripAdded: () => void;
  onCancel: () => void;
}

interface TripFormData {
  date: string;
  startOdometer: string;
  endOdometer: string;
  purpose: string;
  notes: string;
}

const TripForm: React.FC<TripFormProps> = ({ onTripAdded, onCancel }) => {
  const [newTrip, setNewTrip] = useState<TripFormData>({
    date: new Date().toISOString().split('T')[0],
    startOdometer: '',
    endOdometer: '',
    purpose: '',
    notes: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTrip({
      ...newTrip,
      [name]: value
    });
  };

  const calculateMiles = (): number | '' => {
    if (newTrip.startOdometer && newTrip.endOdometer) {
      const start = parseFloat(newTrip.startOdometer);
      const end = parseFloat(newTrip.endOdometer);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return end - start;
      }
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const miles = calculateMiles();
    
    if (miles === '') {
      alert('Please enter valid odometer readings');
      return;
    }
    
    try {
      const tripToAdd = {
        date: newTrip.date,
        purpose: newTrip.purpose,
        notes: newTrip.notes,
        miles: miles,
        startOdometer: parseFloat(newTrip.startOdometer),
        endOdometer: parseFloat(newTrip.endOdometer)
      };
      
      await addTrip(tripToAdd);
      onTripAdded();
      
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Error saving trip');
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Add New Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                Date
              </Label>
            </div>
            <TextInput
              id="date"
              type="date"
              name="date"
              value={newTrip.date}
              onChange={handleInputChange}
              required
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <div>
            <div className="mb-2">
              <Label htmlFor="purpose" className="text-gray-700 dark:text-gray-300">
                Purpose
              </Label>
            </div>
            <TextInput
              id="purpose"
              type="text"
              name="purpose"
              value={newTrip.purpose}
              onChange={handleInputChange}
              placeholder="Business purpose"
              required
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <Label htmlFor="startOdometer" className="text-gray-700 dark:text-gray-300">
                Start Odometer
              </Label>
            </div>
            <TextInput
              id="startOdometer"
              type="number"
              name="startOdometer"
              value={newTrip.startOdometer}
              onChange={handleInputChange}
              placeholder="Starting miles"
              required
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <div>
            <div className="mb-2">
              <Label htmlFor="endOdometer" className="text-gray-700 dark:text-gray-300">
                End Odometer
              </Label>
            </div>
            <TextInput
              id="endOdometer"
              type="number"
              name="endOdometer"
              value={newTrip.endOdometer}
              onChange={handleInputChange}
              placeholder="Ending miles"
              required
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
              Notes
            </Label>
          </div>
          <Textarea
            id="notes"
            name="notes"
            value={newTrip.notes}
            onChange={handleInputChange}
            placeholder="Optional notes"
            rows={2}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        
        {calculateMiles() !== '' && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-center">
            Trip Distance: <span className="font-bold">{calculateMiles()} miles</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" color="blue">
            Save Trip
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TripForm;