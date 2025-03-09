import axios from 'axios';

const API_URL = 'https://backendsongs-93gj.onrender.com/api/songs';

export const getSongs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createSong = async (song) => {
    const response = await axios.post(API_URL, song);
    return response.data;
};

export const updateSong = async (id, song) => {
    const response = await axios.put(`${API_URL}/${id}`, song);
    return response.data;
};

export const deleteSong = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
