import axios from "./axios";

export async function getComplaintRankingByEvents() {
    let response = await axios.get(`/complaints/ranking/event`);
    let rankings = [];
    response.data.forEach(async (event, index) => {
        const detail = await axios.get(`/events/${event.event_id}`);
        const organizer = await axios.get(`/organizers/${detail.data.organizer}`);
        const organizer_name =`${organizer.data.first_name} ${organizer.data.last_name}`;
        const ranking = {
            complaints: event.complaints,
            event_id: event.event_id,
            event: detail.data.name,
            organizer: organizer_name,
            state: detail.data.state,
        }
        rankings[index] = ranking;
    });
    console.log("Ranking", rankings);
    return rankings;
}

export async function getEvent(id) {
    return await axios.get(`/events/${id}`);
}

export async function getComplaintByEvent(event_id) {
    const response = await axios.get(`/complaints/event/${event_id}`);
    const complaints = response.data;
    for (let index = 0; index < complaints.length; index += 1) {
        const complaint = complaints[index];
        const complainer = await axios.get(`/users/${complaint.complainer_id}`);
        const complainer_name =`${complainer.data.first_name} ${complainer.data.last_name}`;
        complaints[index].complainer_name = complainer_name;
    }
    return complaints;
}

/*export async function getComplaintByOrganizer(organizer_id) {
    const response = await axios.get(`/complaints/organizer/${organizer_id}`);
    const complaints = response.data;
    for (let index = 0; index < complaints.length; index += 1) {
        const complaint = complaints[index];
        const complainer = await axios.get(`/users/${complaint.complainer_id}`);
        const event = await axios.get(`/events/${complaint.event_id}`);
        const complainer_name =`${complainer.data.first_name} ${complainer.data.last_name}`;
        complaints[index].complainer = complainer_name;
        complaints[index].event = event.data.name;
    }
    return complaints;
} */

export async function suspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/suspend`);
}

export async function unsuspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/unsuspend`);
}