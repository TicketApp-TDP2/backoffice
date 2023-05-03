import axios from "./axios";

export async function getOrganizer(id) {
    return await axios.get(`/organizers/${id}`);
}

export async function getComplaintRankingByOrganizer() {
    let response = await axios.get(`/complaints/ranking/organizer`);
    let rankings = response.data;
    for (let index = 0; index < rankings.length; index += 1) {
        const ranking = rankings[index];
        const organizer = await axios.get(`/organizers/${ranking.organizer_id}`);
        const organizer_name =`${organizer.data.first_name} ${organizer.data.last_name}`;
        rankings[index].organizer = organizer_name;
        rankings[index].state = organizer.data.suspended;
    }
    return rankings;
}

export async function getComplaintByOrganizer(organizer_id) {
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
}


export async function suspendOrganizer(organizer_id) {
    return await axios.put(`/organizers/${organizer_id}/suspend`);
}

export async function unsuspendOrganizer(organizer_id) {
    return await axios.put(`/organizers/${organizer_id}/unsuspend`);
}