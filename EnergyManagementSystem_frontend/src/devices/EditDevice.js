import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditDevice() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [device, setDevice] = useState({
    description: "",
    address: "",
    maxHourlyEnergyConsumption: "",
    userId: null,
  });

  const { description, address, maxHourlyEnergyConsumption, userId } = device;

  const onInputChange = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const loadDevice = async () => {
    const result = await axios.get(`http://device.localhost/device/${id}`);
    setDevice(result.data);
  };

  useEffect(() => {
    loadDevice();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://device.localhost/device/${id}`, {
      description,
      address,
      maxHourlyEnergyConsumption,
      userId,
    });
    navigate("/device");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit Device</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={description}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={address}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Max Hourly Energy Consumption</label>
              <input
                type="number"
                className="form-control"
                name="maxHourlyEnergyConsumption"
                value={maxHourlyEnergyConsumption}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control"
                name="userId"
                value={userId || ''} 
                onChange={onInputChange}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">Submit</button>
            <Link to="/device" className="btn btn-outline-danger mx-2">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
