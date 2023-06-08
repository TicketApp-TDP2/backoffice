import axios from "./axios";

export async function getStats({start_date, end_date, group_by}) {
    const params = { start_date, end_date, group_by };
    return await axios.get(`/stats`, { params });
}