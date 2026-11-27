import { getticketCounter, setticketCounter, gettickets, settickets } from '../script.ts';
import { saveToStorage, filter } from './listLogic.ts';

interface Ticket{
    id:number,
    title:string,
    status:string,
    priority:string
}

export function initTicketLogic(){
    filter();
    
    document.getElementById("ticketForm")!.addEventListener("submit", function(event) {
        event.preventDefault();
        addTicket();
        filter();
    });

    document.getElementById("statusFilter")!.addEventListener("change", filter);

    function dataSanitization(id:number, title:string, status:string, priority:string) {
        const messageEl = document.getElementById("message_add");

        if (gettickets().length >= 1000) {
            if (messageEl) {
                messageEl.textContent = "The maximum limit of 1000 tickets has been reached.";
            }
            return false;
        }

        if (!id || typeof id !== "string" || String(id).trim().length === 0 || String(id).length > 100) {
            if (messageEl) {
                messageEl.textContent = "Invalid ticket ID.";
            }
            return false;
        }

        const trimmedTitle = title ? title.trim() : "";
        if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
            if (messageEl) {
                messageEl.textContent = "The title must be between 3 and 80 characters long.";
            }
            return false;
        }

        if (status !== 'new' && status !== 'doing' && status !== 'done') {
            if (messageEl) {
                messageEl.textContent = "Invalid ticket status.";
            }
            return false;
        }

        if (priority !== 'low' && priority !== 'normal' && priority !== 'high') {
            if (messageEl) {
                messageEl.textContent = "Invalid ticket priority.";
            }
            return false;
        }

        if (messageEl) {
            messageEl.textContent = "";
        }
        return true;
    }

    function addTicket() {
        const form : HTMLFormElement= document.getElementById('ticketForm') as HTMLFormElement;
        const formData = new FormData(form);

        const rawTitle : FormDataEntryValue= formData.get('title') || "";
        const cleanTitle : string = String(rawTitle).trim();
        const priority : string = String(formData.get('priority') || "normal");
        const status : string = 'new';
        const id : number = Number(getticketCounter());

        if (dataSanitization(id, cleanTitle, status, priority)) {
            gettickets().push({
                id: id,
                title: cleanTitle,
                status: status,
                priority: priority
            });

            setticketCounter(getticketCounter() + 1);
            saveToStorage();
            form.reset();
        }
    }

    function changeStatus()
    {
        const tickets = gettickets();
        let ticketId = (<HTMLInputElement>document.getElementById("ticketId"))!.value;
        let newStatus = (<HTMLSelectElement>document.getElementById("newStatus"))!.value;

        if (ticketId.trim() === "" || isNaN(Number(ticketId)))
        {
            document.getElementById("message_change")!.textContent = "Ticket ID must be a number.";
            return;
        }

        let found = false;

        for (let i = 0; i < tickets.length; i++)
        {
            let ticket:Ticket=tickets[i];
            if (Number(ticketId) === Number(tickets[i].id))
            {
                ticket.status = newStatus;
                found = true;
                break;
            }
        }

        if (!found)
        {
            document.getElementById("message_change")!.textContent = "No ticket found with this ID.";
            return;
        }

        saveToStorage();
        document.getElementById("message_change")!.textContent = "Ticket status updated successfully.";
        filter();
    }

    function resetMemory()
    {
        settickets([]);
        setticketCounter(1);
        filter();
    }

    const resetId=document.getElementById('resetMemory');
    resetId!.addEventListener("click", function(event) {
        resetMemory();
    });

    const changeStatusId=document.getElementById('changeStatus');
    changeStatusId!.addEventListener("click", function(event) {
        changeStatus();
    });
}