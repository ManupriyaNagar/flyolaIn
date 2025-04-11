import React from "react";

const TravelerInfoStep = ({ travelerDetails, setTravelerDetails, handleNextStep, handlePreviousStep }) => {
  const handleSubmit = () => {
    const { title, fullName, dateOfBirth, email, phone, address } = travelerDetails;
    if (!title || !fullName || !dateOfBirth || !email || !phone || !address) {
      alert("Please fill in all required fields.");
      return;
    } 
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    handleNextStep();
  };

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-20">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Traveler Info
      </h2>
      <div className="space-y-4">
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <p>Please fill in the traveler details below.</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Adult - 1</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-1">Title</label>
              <select
                value={travelerDetails.title}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={travelerDetails.fullName}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, fullName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={travelerDetails.dateOfBirth}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, dateOfBirth: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={travelerDetails.email}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={travelerDetails.phone}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Address</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={travelerDetails.address}
                onChange={(e) => setTravelerDetails({ ...travelerDetails, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next: Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelerInfoStep;