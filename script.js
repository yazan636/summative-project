let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

function saveData() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

function calculatePriority(dueDate, hours) {
    let today = new Date();
    let due = new Date(dueDate);
    let diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff <= 0) diff = 1;
    return Math.round((hours * 10) / diff);
}

function addAssignment() {
    let name = document.getElementById("assignmentName").value;
    let dueDate = document.getElementById("dueDate").value;
    let hours = Number(document.getElementById("studyHours").value);

    if (name === "" || dueDate === "" || hours <= 0) {
        alert("Please complete all fields.");
        return;
    }

    let priority = calculatePriority(dueDate, hours);
    assignments.push({ name, dueDate, hours, priority, completed: false });
    assignments.sort((a, b) => b.priority - a.priority);

    saveData();
    displayAssignments();

    document.getElementById("assignmentName").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("studyHours").value = "";
}

function toggleDone(index) {
    assignments[index].completed = !assignments[index].completed;
    saveData();
    displayAssignments();
}

function deleteAssignment(index) {
    assignments.splice(index, 1);
    saveData();
    displayAssignments();
}

function displayAssignments() {
    let list = document.getElementById("assignmentList");
    list.innerHTML = "";

    assignments.forEach((item, index) => {
        let div = document.createElement("div");
        let level = item.priority >= 20 ? "high" : item.priority >= 10 ? "medium" : "low";
        if (item.completed) level += " done";
        
        div.className = "assignment " + level;
        div.innerHTML = `
            <strong>${item.name}</strong><br>
            Due: ${item.dueDate} | Hours: ${item.hours} | Priority: ${item.priority}<br>
            <button onclick="toggleDone(${index})">${item.completed ? "Undo" : "Complete"}</button>
            <button onclick="deleteAssignment(${index})">Delete</button>
        `;
        list.appendChild(div);
    });

    document.getElementById("urgentTask").innerText = assignments.length > 0 ? assignments[0].name : "None";
}

displayAssignments();
