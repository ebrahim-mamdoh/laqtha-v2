import { apiClient } from "@/lib/api";

const mapTicket = (ticket) => ({
    id: ticket._id,
    number: ticket.ticketNumber,
    customer: ticket.userId?.name || "-",
    email: ticket.userId?.email || "-",
    category: ticket.category || "-",
    issue: ticket.subject || ticket.message || "-",
    priority: ticket.priority || "-",
    status: ticket.status || "-",
    createdAt: ticket.createdAt
});

export async function fetchTickets() {
    const { data } = await apiClient.get("/v2/admin/tickets");
    const tickets = data?.data?.tickets || [];
    return tickets.map(mapTicket);
}
