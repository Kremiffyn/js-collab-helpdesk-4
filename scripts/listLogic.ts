import { gettickets, getticketCounter } from '../script.ts';

interface Ticket{
    id:number,
    title:string,
    status:string,
    priority:string
}

export function saveToStorage() {
    localStorage.setItem("tickets", JSON.stringify(gettickets()));
    localStorage.setItem("ticketCounter", String(getticketCounter()));
}

export function filter() {
    const statusFilterEl = document.getElementById("statusFilter")! as HTMLSelectElement;
    const value_filter = statusFilterEl ? statusFilterEl.value : "all";
    const list = document.getElementById("ticketList");

    if (!list) return;

    list.innerHTML = "";

    let visibleCount = 0;
    const tickets = gettickets();

    for (let i = 0; i < tickets.length; i++) {
        let ticket:Ticket=tickets[i];
        if (value_filter === "all" || ticket.status === value_filter) {
            const ticketRow = createTicketRow(ticket);
            list.appendChild(ticketRow);
            visibleCount++;
        }
    }

    if (visibleCount === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No tickets to display.";
        emptyLi.style.textAlign = "center";
        emptyLi.style.fontStyle = "italic";
        list.appendChild(emptyLi);
    }

    const visibleCountEl : HTMLElement= document.getElementById("visibleCount")!;
    const totalCountEl : HTMLElement = document.getElementById("totalCount")!;

    if (visibleCountEl) visibleCountEl.textContent = String(visibleCount);
    if (totalCountEl) totalCountEl.textContent = String(tickets.length);
}

export function createTicketRow(ticket:Ticket) {
    const li = document.createElement("li");

    const p1 = document.createElement("p");
    p1.textContent = "Id: " + ticket.id;

    const p2 = document.createElement("p");
    p2.textContent = "Title: " + ticket.title;

    const p3 = document.createElement("p");
    p3.textContent = "Status: " + ticket.status;

    const p4 = document.createElement("p");
    p4.textContent = "Priority: " + ticket.priority;

    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    li.appendChild(p4);

    return li;
}