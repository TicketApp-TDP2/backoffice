import axios from "./axios";

export async function getOrganizer(id) {
    return await axios.get(`/organizers/${id}`);
}