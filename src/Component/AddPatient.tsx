import { useState } from "react";

export default function AddPatient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [remarks, setRemarks] = useState("");
  const [category, setCategory] = useState("General");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 sm:p-10">
        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6 uppercase">Add Patient</h2>

        <form className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {/* Phone */}
          <div className="grid grid-cols-3 gap-4">
            <select className="border border-gray-300 rounded px-3 py-2">
              <option>IND +91</option>
              {/* Add more countries if needed */}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-2 border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Gender, Age, DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {/* City and Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Aadhaar */}
          <input
            type="text"
            placeholder="Aadhaar Card No."
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {/* Remarks and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option>General</option>
              <option>Emergency</option>
              <option>OPD</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
