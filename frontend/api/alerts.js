import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_ALERTS_URL || "https://alerts.example.com";

export const getAlertSummary = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/alerts/${id}`, { params: { summary: true } });
    return res.data;
  } catch (err) {
    console.error("getAlertSummary error", err.response?.data || err.message);
    throw err;
  }
};

export const getAlertDetails = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/alerts/${id}`);
    return res.data;
  } catch (err) {
    console.error("getAlertDetails error", err.response?.data || err.message);
    throw err;
  }
};

