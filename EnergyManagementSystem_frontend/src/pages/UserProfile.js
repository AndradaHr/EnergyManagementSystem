import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Button, Alert } from 'react-bootstrap';
import './UserProfile.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState({});
  const [energyData, setEnergyData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfileAndDevices = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userProfileResponse = await axios.get('http://user.localhost/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userProfileResponse.data);

        const userId = userProfileResponse.data.id;
        const devicesResponse = await axios.get(`http://device.localhost/device/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevices(devicesResponse.data);
        setError(null);
      } catch (error) {
        console.error("Eroare la obținerea profilului și dispozitivelor", error);
        setError('Eroare la încărcarea datelor utilizatorului sau dispozitivelor.');
        navigate('/login');
      }
    };

    fetchUserProfileAndDevices();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      devices.forEach((device) => {
        if (selectedDate[device.id]) {
          fetchEnergyConsumption(device.id, selectedDate[device.id]);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [devices, selectedDate]);

  const handleSimulate = async (deviceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:8090/simulator/simulate?deviceId=${deviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setError('Eroare la trimiterea simulării. Încearcă din nou.');
      console.error('Eroare la trimiterea simulării:', error);
    }
  };

  const handleStopSimulation = async (deviceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.get(`http://localhost:8090/simulator/stop?deviceId=${deviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setError('Eroare la oprirea simulării. Încearcă din nou.');
      console.error('Eroare la oprirea simulării:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchEnergyConsumption = async (deviceId, date) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://monitoring.localhost/monitoring/consumption?deviceId=${deviceId}&date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnergyData((prevData) => ({
        ...prevData,
        [deviceId]: response.data,
      }));
    } catch (error) {
      setError('Eroare la obținerea datelor istorice.');
      console.error('Eroare la obținerea datelor istorice', error);
    }
  };

  const handleDateChange = (deviceId, event) => {
    const newDate = event.target.value;
    setSelectedDate((prevDates) => ({
      ...prevDates,
      [deviceId]: newDate,
    }));
    fetchEnergyConsumption(deviceId, newDate);
  };

  const EnergyChart = ({ deviceId, energyData }) => {
    const data = {
      labels: energyData.map((item) => `${item.hour}:00`),
      datasets: [
        {
          label: 'Energy Consumption (kWh)',
          data: energyData.map((item) => item.totalConsumption),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };

    return <Line data={data} />;
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
      <div className="user-profile container mt-5">
        <div className="profile-container">
          <div className="user-card">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                className="profile-img"
                alt="User"
            />
            <div className="card-body text-center">
              <h5 className="card-title">{user.username}</h5>
              <p className="card-text">{user.email}</p>
              <p className="card-text">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="my-devices">
            <h5 className="text-center mb-3 text-dark">My Devices</h5>
            {devices.length ? (
                <ListGroup variant="flush">
                  {devices.map((device) => (
                      <ListGroup.Item key={device.id} className="device-item shadow-sm rounded">
                        <div><strong>Device ID:</strong> {device.id}</div>
                        <div><strong>Description:</strong> {device.description}</div>
                        <div><strong>Max Energy Consumption:</strong> {device.maxHourlyEnergyConsumption} kWh</div>

                        <div className="button-group">
                          <Button variant="primary" onClick={() => handleSimulate(device.id)}>Simulate</Button>
                          <Button variant="secondary" onClick={() => handleStopSimulation(device.id)}>Stop</Button>
                        </div>

                        <input
                            type="date"
                            onChange={(event) => handleDateChange(device.id, event)}
                            className="form-control mb-3"
                        />

                        {energyData[device.id] && energyData[device.id].length > 0 && (
                            <EnergyChart deviceId={device.id} energyData={energyData[device.id]} />
                        )}
                      </ListGroup.Item>
                  ))}
                </ListGroup>
            ) : (
                <p className="text-center text-muted">No devices found.</p>
            )}
          </div>
        </div>

        {error && <Alert variant="danger" className="alert-container">{error}</Alert>}

        <Button
            variant="danger"
            onClick={handleLogout}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
            }}
        >
          Logout
        </Button>
      </div>
  );
};

export default UserProfile;
