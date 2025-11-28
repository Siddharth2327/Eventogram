import axiosInstance from './axiosInstance';

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('/events/create-event', eventData);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateEvent = async (eventId, updateData) => {
  try {
    const response = await axiosInstance.put(`/events/update-event/${eventId}`, updateData);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserEvents = async (userId) => {
  try {
    const response = await axiosInstance.get(`/events/get-userevents/${userId}`);
    console.log(response);
    return response.data.data || [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getEventLogs = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/events/get-eventlogs/${eventId}`);
    // console.log(response);
    return response.data;
   
  } catch (err) {
    console.log(err);
    throw err;
  }
};
