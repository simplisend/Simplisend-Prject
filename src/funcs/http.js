import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api/";

const getRequest = (endpoint, base = null) => {
  const token = localStorage.getItem("token");
  let dest;
  if (base === null) {
    dest = baseUrl + endpoint;
  } else {
    dest = base + endpoint;
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`
  };
  return axios.get(dest, { headers });
};

const request = (endpoint, payload, method = "POST") => {
  const token = localStorage.getItem("token");
  const dest = baseUrl + endpoint;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`
  };
  return axios({
    url: dest,
    data: payload,
    method,
    headers
  });
};

const deleteRequest = endpoint => {
  const token = localStorage.getItem("token");
  const dest = baseUrl + endpoint;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`
  };
  return axios({
    url: dest,
    method: "DELETE",
    headers
  });
};

export { getRequest, request, deleteRequest };
