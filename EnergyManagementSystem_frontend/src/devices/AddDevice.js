import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddDevice() {
  let navigate = useNavigate();

  const [device, setDevice] = useState({
    description: "",
    address: "",
    maxHourlyEnergyConsumption: "",
    userId: "", 
  });

  const { description, address, maxHourlyEnergyConsumption, userId } = device;

  const onInputChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://device.localhost/device", {
        description,
        address,
        maxHourlyEnergyConsumption,
        userId,
      });
      navigate("/device"); 
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add Device</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter device description"
                name="description"
                value={description}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter device address"
                name="address"
                value={address}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maxHourlyEnergyConsumption" className="form-label">
                Max Hourly Energy Consumption
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter max hourly energy consumption"
                name="maxHourlyEnergyConsumption"
                value={maxHourlyEnergyConsumption}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">
                User ID
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter user ID"
                name="userId"
                value={userId}
                onChange={onInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link to="/device" className="btn btn-outline-danger mx-2">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
