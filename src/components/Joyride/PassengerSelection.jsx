"use client";

import { useState, useEffect, useMemo } from 'react';

const PassengerSelection = ({ selectedSlot, onSubmit }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    passengers: [{ name: '', weight: '' }],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // Update passengers array when passengerCount changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passengers: Array.from({ length: passengerCount }, (_, i) =>
        prev.passengers[i] || { name: '', weight: '' }
      ),
    }));
  }, [passengerCount]);

  // Calculate total price
  const calculatedTotalPrice = useMemo(() => {
    if (!selectedSlot || !selectedSlot.price) return 0;
    const basePrice = selectedSlot.price * passengerCount;
    const extraWeightCharges = formData.passengers.reduce((total, passenger) => {
      const weight = parseFloat(passenger.weight) || 0;
      return total + (weight > 75 ? (weight - 75) * 500 : 0);
    }, 0);
    return basePrice + extraWeightCharges;
  }, [passengerCount, formData.passengers, selectedSlot?.price]);

  useEffect(() => {
    setTotalPrice(calculatedTotalPrice);
  }, [calculatedTotalPrice]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('passenger')) {
      const field = name.split('-')[1];
      const updatedPassengers = [...formData.passengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      setFormData({ ...formData, passengers: updatedPassengers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || passengerCount < 1 || passengerCount > selectedSlot.seats) {
      alert(`Please fill all fields and ensure 1-${selectedSlot.seats} passengers.`);
      return;
    }
    for (let i = 0; i < passengerCount; i++) {
      if (!formData.passengers[i].name || !formData.passengers[i].weight) {
        alert('Please fill all passenger details.');
        return;
      }
      const weight = parseFloat(formData.passengers[i].weight);
      if (isNaN(weight) || weight <= 0) {
        alert(`Please enter a valid weight for passenger ${i + 1}.`);
        return;
      }
    }
    onSubmit({ ...formData, totalPrice });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Passenger Details</h2>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="text-sm">
          <strong>Note:</strong> Maximum {selectedSlot.seats} passengers per slot, with a weight limit of 70-75 kg per person. Heavier passengers (over 75 kg) incur ₹500 per kg extra.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Number of Passengers (Max {selectedSlot.seats})</label>
          <input
            type="number"
            value={passengerCount}
            onChange={(e) => setPassengerCount(Math.min(selectedSlot.seats, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full p-2 border rounded"
            required
            min="1"
            max={selectedSlot.seats}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Main Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange(e)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {formData.passengers.map((passenger, index) => (
          <div key={index} className="border-t pt-4">
            <h3 className="text-sm font-medium">Passenger {index + 1}</h3>
            <div className="mt-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name={`passenger-name-${index}`}
                value={passenger.name}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                type="number"
                name={`passenger-weight-${index}`}
                value={passenger.weight}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full p-2 border rounded"
                required
                min="1"
                step="0.1"
              />
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Total Price: ₹{isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            (Base price: ₹{selectedSlot.price} × {passengerCount} passenger(s) + extra weight charges)
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default PassengerSelection;