import axiosInstance from './axiosInstance';

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users/create-user', userData);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users/get-all-users');
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateUserTimezone = async (name, newTimezone) => {
  try {
    const response = await axiosInstance.put('/users/update-user-timezone', { name, newTimezone });
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
