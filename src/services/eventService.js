import axios from "./axios";

export async function getComplaintRankingByEvents({ start, end }) {
    const params = { start, end };
    console.log("Params", params);
    let response = await axios.get(`/complaints/ranking/event`, { params });
    console.log("Data", response.data)
    let rankings = response.data;
    for (let index = 0; index < rankings.length; index += 1) {
        const ranking = rankings[index];
        const event = await axios.get(`/events/${ranking.event_id}`);
        const organizer = await axios.get(`/organizers/${event.data.organizer}`);
        const organizer_name =`${organizer.data.first_name} ${organizer.data.last_name}`;
        rankings[index].organizer = organizer_name;
        rankings[index].event = event.data.name;
        rankings[index].state = event.data.state;
    }
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

export async function suspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/suspend`);
}

export async function unsuspendEvent(event_id) {
    return await axios.put(`/events/${event_id}/unsuspend`);
}

export async function getUsersEnrolled(eventId) {
    let users = [];
    const bookings = await axios.get(`bookings/event/${eventId}`);
    for (const booking of bookings.data) {
        users.push(booking.reserver_id);
    }

    return users;
}

export async function getEventsByOrganizer(organizerId) {
    return await axios.get(`/events`, { params: {organizer: organizerId}});
}

export async function getEvents() {
    return await axios.get(`/events`);
}