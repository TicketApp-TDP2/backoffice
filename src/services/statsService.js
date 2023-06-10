import axios from "./axios";

export async function getStats({start_date, end_date}) {
    const params = { start_date, end_date, group_by: "month" };
    return await axios.get(`/stats`, { params });
}