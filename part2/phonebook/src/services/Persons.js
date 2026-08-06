import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const create = newObject => {
  return axios.post(baseUrl, newObject)
              .then(response => response.data)
}

const editPerson = person => {
  return axios.put(`${baseUrl}/${person.id}`, person)
}

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

export default { 
  create,
  editPerson,
  deletePerson,
  getAll
}