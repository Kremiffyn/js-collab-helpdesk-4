let ticketCounter = Number(localStorage.getItem("ticketCounter")) || 1;
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
const link = document.createElement('a');
let filename;

document.addEventListener('DOMContentLoaded', function () {

    const headings = [document.querySelector('h1'), document.querySelector('.tickets-section > h2')];

    const colors = ['#ffa81d','#59ce7e','#ffdb45','#398cff','#f247de'];

    function createLights(heading) 
    {

        if (!heading) return;
        let lights = heading.querySelector('.title-lights');

        if (!lights) 
        {
            lights = document.createElement('div');
            lights.className = 'title-lights';
            heading.appendChild(lights);
        }

        lights.innerHTML = '';

        const width = lights.clientWidth;
        const height = lights.clientHeight;
        const inset = 5;
        const left = inset;
        const right = width - inset;
        const top = inset;
        const bottom = height - inset;
        const horizontal = right - left;
        const vertical = bottom - top;
        const perimeter = 2 * (horizontal + vertical);
        const spacing = 55;
        const count = Math.floor(perimeter / spacing);
        const actualSpacing = perimeter / count;

        for (let i = 0; i < count; i++) 
        {
            const distance = i * actualSpacing;
            let x, y;

            if (distance < horizontal) 
            {
                x = left + distance;
                y = top;
            }

            else if (distance < horizontal + vertical) 
            {
                x = right;
                y = top + (distance - horizontal);
            }

            else if (distance < 2 * horizontal + vertical) 
            {
                x = right - (distance - horizontal - vertical);
                y = bottom;
            }

            else 
            {
                x = left;
                y = bottom - (distance - 2 * horizontal - vertical);
            }

            createBulb(x, y);
        }

        
    function createBulb(x, y) 
    {

       const bulb = document.createElement('span');
       bulb.className = 'title-bulb';
       bulb.style.left = x + 'px';
       bulb.style.top = (y + 2.5) + 'px';

       bulb.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
       bulb.style.setProperty('--speed', (1.5 + Math.random() * 2) + 's');
       bulb.style.setProperty('--delay', (Math.random() * 3) + 's');

       lights.appendChild(bulb);
    }

    }

    headings.forEach(createLights);

    window.addEventListener('resize', function () 
    {
        headings.forEach(createLights);
    });

});


function lightSnowman() 
{
    let img = document.getElementById("Snowman");

    if (img.src.includes("images/Snowman.png")) 
        {
            const snowmanSound=new Audio('./sounds/lighting.mp3');
            snowmanSound.play();
        img.src = "images/Snowman_light.png";

    } else {
        const snowmanSound=new Audio('./sounds/no_lighting.mp3');
            snowmanSound.play();
        img.src = "images/Snowman.png";
    }
}

function saveToStorage() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("ticketCounter", ticketCounter);
}

window.onload = function(){
    filter();
}

document.getElementById("ticketForm").addEventListener("submit", function(event) {
    event.preventDefault();
    addTicket();
    filter();
});

document.getElementById("exJSON").addEventListener("click", (event) => {
    event.preventDefault();
    exportJSON();
});

document.getElementById("exCSV").addEventListener("click", (event) => {
    event.preventDefault();
    exportCSV();
});

document.getElementById("exXML").addEventListener("click", (event) => {
    event.preventDefault();
    exportXML();
});

document.getElementById("statusFilter").addEventListener("change", filter);

function createTicketRow(ticket) {
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

function dataSanitization(id, title, status, priority) {
    const messageEl = document.getElementById("message_add");
    
    if (tickets.length >= 1000) {
        if (messageEl) {
            messageEl.textContent = "The maximum limit of 1000 tickets has been reached.";
        }
        return false;
    }

    if (!id || typeof id !== "string" || id.trim().length === 0 || id.length > 100) {
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
    const form = document.getElementById('ticketForm');
    const formData = new FormData(form);

    const rawTitle = formData.get('title') || "";
    const cleanTitle = rawTitle.trim();
    const priority = formData.get('priority') || "normal";
    const status = 'new';
    const id = String(ticketCounter);

    if (dataSanitization(id, cleanTitle, status, priority)) {
        tickets.push({
            id: id,
            title: cleanTitle,
            status: status,
            priority: priority
        });

        ticketCounter += 1;
        saveToStorage();
        form.reset();
    }
}

function filter() {
    const value_filter = document.getElementById("statusFilter").value;
    const list = document.getElementById("ticketList");

    list.innerHTML = "";

    let visibleCount = 0;

    for (let i = 0; i < tickets.length; i++) {
        if (value_filter === "all" || tickets[i].status === value_filter) {
            const ticketRow = createTicketRow(tickets[i]);
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

    document.getElementById("visibleCount").textContent = visibleCount;
    document.getElementById("totalCount").textContent = tickets.length;
}

function changeStatus() 
{
    let ticketId = document.getElementById("ticketId").value;
    let newStatus = document.getElementById("newStatus").value;

    if (ticketId.trim() === "" || isNaN(ticketId)) 
    {
        document.getElementById("message_change").textContent = "Ticket ID must be a number.";
        return;
    }

    let found = false;

    for (let i = 0; i < tickets.length; i++) 
    {
        if (Number(ticketId) === Number(tickets[i].id)) 
        {
            tickets[i].status = newStatus;
            found = true;
            break;
        }
    }

    if (!found)
    {
        document.getElementById("message_change").textContent = "No ticket found with this ID.";
        return;
    }

    saveToStorage();
    document.getElementById("message_change").textContent = "Ticket status updated successfully.";
    filter();
}

document.getElementById("fileInput").addEventListener("change", listImport);

async function listImport() {
    try {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (!file) {
            throw new Error("No file selected");
        }

        const extension = file.name.split(".").pop().toLowerCase();

        const text = await file.text();
        let data

        switch(extension) {
            case "json":
                data = JSON.parse(text);
                break;
            
            case "csv":
                const lines = text.trim().split(/\r?\n/)
                const headers = lines[0].split(",").map(h => h.trim());
                const requiredHeaders = ["id", "title", "status", "priority"];
                
                if (!requiredHeaders.every(header => headers.includes(header))) {
                    throw new Error("CSV must contain: id, title, status, priority");
                }

                data = lines.slice(1).map(line => {
                    const values = line.split(",");
                    const ticket = {};

                    headers.forEach((header, index) => {
                        ticket[header] = values[index]?.trim() ?? "";
                    });
                    return ticket;
                })
                break;
            default:
                throw new Error("Invalid file extension. Only JSON and CSV files are allowed.");
        }

        if (data === null || typeof data !== "object" || !Array.isArray(data)) {
            throw new Error("File must contain an array");
        }
        if (data.length >= 1000) {
            throw new Error("File can't contain more than 1000 tickets");
        }

        data.forEach(function(ticket) {
            if (ticket === null || typeof ticket !== "object" || Array.isArray(ticket)) {
                throw new Error("Ticket must be an object");
            }
            if (typeof ticket.id !== "string" ||
                typeof ticket.title !== "string" ||
                typeof ticket.status !== "string" ||
                typeof ticket.priority !== "string"
            ) {
                throw new Error("Invalid data structure");
            }
            if (!ticket.id || ticket.id.trim().length === 0 || ticket.id.length > 100) {
                throw new Error("Invalid ticket Id");
            }
            if (ticket.title.trim().length < 3 || ticket.title.trim().length > 80) {
                throw new Error("The title must be between 3 and 80 characters long.");
            }
            if (ticket.status !== 'new' && ticket.status !== 'doing' && ticket.status !== 'done') {
                throw new Error("Invalid ticket Status");
            }
            if (ticket.priority !== 'low' && ticket.priority !== 'normal' && ticket.priority !== 'high') {
                throw new Error("Invalid ticket Priority");
            }
        })
        const ids = data.map(ticket => ticket.id);
        if (new Set(ids).size !== ids.length) {
            throw new Error("Ticket IDs must be unique");
        }
        
        tickets = data.map(ticket => ({
            id: ticket.id,
            title: ticket.title.trim(),
            status: ticket.status,
            priority: ticket.priority
        }));

        const numericIds = tickets
            .map(ticket => Number(ticket.id))
            .filter(id => Number.isSafeInteger(id) && id >= 0);

        ticketCounter = Math.max(0, ...numericIds) + 1;

        saveToStorage();
        document.getElementById('ticketForm').reset();
        filter();
        document.getElementById("message_import").textContent = "Import succesful";
    } catch (error) {
        document.getElementById("message_import").textContent = error.message;
    }
}

function resetMemory() 
{
    tickets = [];
    ticketCounter = 1;
    saveToStorage();
    filter();
}

// LisLogic
const lisioImg = document.getElementById("Fox");

function createParticle(x, y) {
  const particle = document.createElement("img");
  particle.classList.add("particle");
  particle.src = "images/heart.png";
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  document.body.appendChild(particle);
  return particle;
}

lisioImg.addEventListener("click", function(event) {
  let soundId=Math.floor(Math.random() * 9)+1;
  const foxSound=new Audio('./foxSounds/foxsound'+soundId+'.wav');
  foxSound.play();

  const x = event.pageX;
  const y = event.pageY;
  
  const particle = createParticle(x, y);
  
  particle.addEventListener("animationend", function() {
    particle.remove();
  });
});

function exportJSON()
{
    filename='export.json';

    const text = JSON.stringify(tickets);

    link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(text);
    link.download = filename;
    link.click();
}

function exportCSV()
{
    filename='export.csv';

    let textCSV='';

    tickets.forEach(i => {
        textCSV+=`${i.id},${i.title},${i.status},${i.priority}\n`
    });
    
    link.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(textCSV);
    link.download = filename;
    link.click();
}

function exportXML()
{
    filename='export.xml';

    let textXML='<?xml version="1.0" encoding="UTF-8"?>';
    textXML+='<tickets>';

    tickets.forEach(i => {
        textXML+=`<ticket id="${i.id}"><title>${i.title}</title><status>${i.status}</status><priority>${i.priority}</priority></ticket>`
    });
   
    textXML+='</tickets>';
    link.href = 'data:application/xml;charset=utf-8,' + encodeURIComponent(textXML);
    link.download = filename;
    link.click();
}



// - Jak to jest być skrybą? Dobrze?
// Moim zdaniem to nie ma tak, że dobrze albo że nie dobrze. 
// Gdybym miał powiedzieć, co cenię w życiu najbardziej, powiedziałbym, że ludzi. 
// Ekhm... Ludzi, którzy podali mi pomocną dłoń, kiedy sobie nie radziłem, kiedy byłem sam. 
// I co ciekawe, to właśnie przypadkowe spotkania wpływają na nasze życie. 
// Chodzi o to, że kiedy wyznaje się pewne wartości, nawet pozornie uniwersalne, bywa, że nie znajduje się zrozumienia, które by tak rzec, które pomaga się nam rozwijać. 
// Ja miałem szczęście, by tak rzec, ponieważ je znalazłem. 
// I dziękuję życiu. 
// Dziękuję mu, życie to śpiew, życie to taniec, życie to miłość. 
// Wielu ludzi pyta mnie o to samo, ale jak ty to robisz?, skąd czerpiesz tę radość? 
// A ja odpowiadam, że to proste, to umiłowanie życia, to właśnie ono sprawia, że dzisiaj na przykład buduję maszyny, a jutro... kto wie, dlaczego by nie, oddam się pracy społecznej i będę ot, choćby sadzić... doć... marchew. 






























































































































































































































































































































































































































































































































































































































































































































































































































if(!lisioImg || !lisioImg.hasAttribute("src") || lisioImg.getAttribute("src") != "images/ArcticFox.png") document.querySelector("body").innerHTML="<p>Oddawaj lisa >:(</p>";
