import axios from 'axios';

// const apiUrl = "https://localhost:5142"//7083
axios.defaults.baseURL = 'http://localhost:5142/';//https://localhost:3000/';//7083//5142
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error("Api Request Error: ", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
)
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  //get all tasks
  getTasks: async () => {
    const result = await axios.get(`/items`)
    return result.data;
  },

  //create a new task
  addTask: async (name) => {
    const result = await axios.post(`/items`, { name: name, isComplete: false });
    return result.data;
  },
  //update doing task
  setCompleted: async (id, name, isComplete) => {
    if (!id || name === undefined || isComplete === undefined) {
      console.error("Missing: ", { id, name, isComplete });
      return;
    }
    const taskUpdate = {
      name: name,
      isComplete: isComplete
    }
    try {
      const result = await axios.put(`/items/${id}`, taskUpdate);
      return result.data;
    } catch (error) {
      console.error("Error Updating Task")
      throw error;
    }
  },
  //delete task
  deleteTask: async (id) => {
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  }
};
