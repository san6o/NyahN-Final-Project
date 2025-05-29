function populateDays() {
    //day dropdown
    const daySelect = document.getElementById("day");

    //clear dropdown & reset
    daySelect.innerHTML = '<option value="" disabled selected>Select day</option>';

    //loop numbers 1-31 to create days
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement("option");
        option.value = i; //set value of option to day number
        option.textContent = i; //set the displayed text to the day number
        daySelect.appendChild(option); //add option to the dropdown
    }
}

//call populateDays dropdown when loaded
window.onload = function() {
    populateDays();
};

//print task with selected date prioritize option
function printTask() {
    //get user’s tasks
    const inputElement = document.getElementById("task");  //task text 
    const taskText = inputElement.value.trim();  //trimmed task text
    const monthSelect = document.getElementById("month");  //selected month
    const daySelect = document.getElementById("day");  //selected day
    const monthValue = monthSelect.value;  //month
    const dayValue = daySelect.value;  //day value

    //check if task and date are provided
    if (taskText && monthValue && dayValue) {
        //create a new task
        const taskList = document.getElementById("taskList");  //get task list

        //create a new list item for task
        const newTaskItem = document.createElement("li");
        newTaskItem.className = "task-item";  // Set class for task item

        //create task
        const taskTextElement = document.createElement("span");
        taskTextElement.className = "task-text";
        taskTextElement.textContent = taskText;

        //create task date
        const taskDateElement = document.createElement("span");
        taskDateElement.className = "task-date";
        taskDateElement.textContent = `(${monthValue} ${dayValue})`;  //set date

        //delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.onclick = function () {
            //remove task
            taskList.removeChild(newTaskItem);
        };

        //prioritization button
        const prioritizeButton = document.createElement("button");
        prioritizeButton.textContent = "Prioritize";
        let isPrioritized = false;  //task is not prioritized

        prioritizeButton.onclick = function () {
            if (isPrioritized) {
                //undo prioritize remove bold and send task to the bottom
                newTaskItem.style.fontWeight = "normal";  //remove bold
                taskList.appendChild(newTaskItem);  //move task to end
                prioritizeButton.textContent = "Prioritize";
            } else {
                // prioritiZe the task by making bold and moving to top
                newTaskItem.style.fontWeight = "bold"; //add bold
                taskList.prepend(newTaskItem);  //move task to top
                prioritizeButton.textContent = "Undo";
            }
            isPrioritized = !isPrioritized;  //task is prioritized
        };

        //output task, date, prioritize, and delete together
        newTaskItem.appendChild(taskTextElement);  //task
        newTaskItem.appendChild(taskDateElement);  //task date
        newTaskItem.appendChild(prioritizeButton);  //prioritize button
        newTaskItem.appendChild(deleteButton);  //delete button


        //add task item to list
        taskList.appendChild(newTaskItem);

        //reset task buttons
        inputElement.value = "";  //clear input
        monthSelect.selectedIndex = 0;  //reset month
        daySelect.selectedIndex = 0;  //reset date
    } else {
        //show an alert
        alert("Please enter both a task and a date!");
    }
}
