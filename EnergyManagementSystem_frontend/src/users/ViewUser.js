import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ViewUser = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    role: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://user.localhost/user/${id}`);
      setUser(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">User Details</h2>

          <div className="card">
            <div className="card-header">
              Details of user id: {user.id}
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <b>Name:</b> {user.name}
              </li>
              <li className="list-group-item">
                <b>Username:</b> {user.username}
              </li>
              <li className="list-group-item">
                <b>Email:</b> {user.email}
              </li>
              <li className="list-group-item">
                <b>Role:</b> {user.role}
              </li>
            </ul>
          </div>
          <Link className="btn btn-primary my-2" to="/user">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
