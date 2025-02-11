import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DevicesPage.css";

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const result = await axios.get("http://device.localhost/device");
    setDevices(result.data);
  };

  const deleteDevice = async (id) => {
    await axios.delete(`http://device.localhost/device/${id}`);
    loadDevices();
  };

  return (
    <div className="container">
      <div className="py-4">
        <h1>Devices Page</h1>
        <Link to="/admin" className="btn btn-outline-light">Back</Link>
        <Link to="/adddevice" className="btn btn-outline-success mx-2">Add Device</Link>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Description</th>
              <th scope="col">Address</th>
              <th scope="col">Max Energy Consumption</th>
              <th scope="col">User ID</th> {/* User ID column */}
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <th scope="row">{device.id}</th>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.maxHourlyEnergyConsumption} kWh</td>
                <td>{device.userId !== null ? device.userId : "N/A"}</td> {/* Display User ID */}
                <td>
                  <Link className="btn btn-primary mx-2" to={`/viewdevice/${device.id}`}>
                    View
                  </Link>
                  <Link className="btn btn-outline-primary mx-2" to={`/editdevice/${device.id}`}>
                    Edit
                  </Link>
                  <button className="btn btn-danger mx-2" onClick={() => deleteDevice(device.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevicesPage;
