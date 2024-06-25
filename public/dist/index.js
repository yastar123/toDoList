const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filterSelect");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let filteredTasks;

const renderTasks = () => {
    taskList.innerHTML = "";
    const filter = filterSelect.value;
    filteredTasks = tasks.filter(task => {
        if (filter === "all") {
            return true;
        } else if (filter === "complete") {
            return task.completed;
        } else {
            return !task.completed;
        }
    });
    filteredTasks.forEach((task, index) => {
        taskList.appendChild(createListElement(task, index));
    });
};

const createListElement = (task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.classList.add("task");
    if (task.completed) {
        li.classList.add("completed");
    }
    const statusContainer = document.createElement("div");
    statusContainer.classList.add("status-container");

    const buttons = ["Ulangi", "Hapus", "Edit"];
    const actions = [() => toggleCompleted(index), () => deleteTask(index), () => editTask(index)];

    buttons.forEach((text, i) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", actions[i]);
        statusContainer.appendChild(button);
    });

    li.appendChild(statusContainer);
    return li;
};

const toggleCompleted = index => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
};

const deleteTask = index => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const editTask = index => {
    const newText = prompt("Edit task", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
};

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

addTaskButton.addEventListener("click", addTask);
filterSelect.addEventListener("change", renderTasks);
taskInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();
