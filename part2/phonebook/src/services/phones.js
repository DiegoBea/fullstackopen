import axios from "axios";
const baseUrl = "https://phonebook-koo7.onrender.com/api/persons";

const getAll = async () => {
  const request = axios.get(baseUrl);

  const response = await request;
  return response.data;
};

const insert = async (contact) => {
  const request = axios.post(baseUrl, contact);

  return request.then((response) => response.data).catch("Insert failed");
};

const remove = (contact) => {
  const request = axios.delete(`${baseUrl}/${contact.id}`);

  return request.then((response) => response.data).catch("Remove failed");
};

const update = (contact) => {
  const request = axios.put(`${baseUrl}/${contact.id}`, contact);

  return request.then((response) => response.data).catch("Update failed");
};

export default { getAll, insert, update, remove };
