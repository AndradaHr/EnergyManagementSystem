import axios from "axios"; 
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewDevice() {
  const [device, setDevice] = useState({
    id: "",
    description: "",
    address: "",
    maxHourlyEnergyConsumption: "",
    userId: null, 
  });

  const { id } = useParams();

  useEffect(() => {
    const loadDevice = async () => {
      const result = await axios.get(`http://device.localhost/device/${id}`);
      setDevice(result.data);
    };

    loadDevice();
  }, [id]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Device Details</h2>

          <div className="card">
            <div className="card-header">
              Details of device id: {device.id}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Description:</b> {device.description}
                </li>
                <li className="list-group-item">
                  <b>Address:</b> {device.address}
                </li>
                <li className="list-group-item">
                  <b>Max Hourly Energy Consumption:</b> {device.maxHourlyEnergyConsumption} kWh
                </li>
                <li className="list-group-item">
                  <b>User ID:</b> {device.userId !== null ? device.userId : "N/A"}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to="/device">
            Back to Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
