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
    const complaints = [];
    response.data.forEach(async (complaint, idx) => {
        const complainer = await axios.get(`/users/${complaint.complainer_id}`);
        const complainer_name =`${complainer.data.first_name} ${complainer.data.last_name}`;
        const newComplaint = {
            event_id: complaint.event_id,
            complainer_id: complaint.complainer_id,
            type: complaint.type,
            description: complaint.description,
            id: complaint.id,
            organizer_id: complaint.organizer_id,
            complainer_name: complainer_name,
        }
        complaints[idx] = newComplaint;
    });
    return complaints;
}

export async function suspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/suspend`);
}

export async function unsuspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/unsuspend`);
}