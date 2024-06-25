
const getHtmlElement = <T extends HTMLElement>(id: string): T => {
  return document.getElementById(id) as T
}

const taskInput = getHtmlElement<HTMLInputElement>("taskInput")
const addTaskButton = getHtmlElement<HTMLButtonElement>("addTaskBtn")
const taskList = getHtmlElement<HTMLUListElement>("taskList")
const filterSelect = getHtmlElement<HTMLSelectElement>("filterSelect")

interface Task {
  text: string
  completed: boolean
}

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]")
let filteredTasks: Task[] = []

const renderTasks = (): void => {
  taskList.innerHTML = ""
  const filter: string = filterSelect.value

  if (filter === "all") {
      filteredTasks = tasks
  } else if (filter === "complete") {
      filteredTasks = tasks.filter((task) => task.completed)
  } else {
      filteredTasks = tasks.filter((task) => !task.completed)
  }

  filteredTasks.forEach((task, index) => {
      taskList.appendChild(createListElement(task, index))
  })
}

const createListElement = (task: Task, index: number): HTMLLIElement => {
  const li = document.createElement("li")
  li.textContent = task.text
  li.classList.add("task")
  if (task.completed) li.classList.add("completed")

  const statusContainer = document.createElement("div")
  statusContainer.classList.add("status-container")

  const buttons = ["Ulangi", "Hapus", "Edit"]
  const actions = [() => toggleCompleted(index), () => deleteTask(index), () => editTask(index)]

  buttons.forEach((text, i) => {
      const button = document.createElement("button")
      button.textContent = text
      button.addEventListener("click", actions[i])
      statusContainer.appendChild(button)
  })

  li.appendChild(statusContainer)
  return li
}

const toggleCompleted = (index: number): void => {
  tasks[index].completed = !tasks[index].completed
  saveTasks()
  renderTasks()
}

const addTask = (): void => {
  const taskText = taskInput.value.trim()
  if (taskText !== "") {
      tasks.push({ text: taskText, completed: false })
      taskInput.value = ""
      saveTasks()
      renderTasks()
  }
}

const deleteTask = (index: number): void => {
  tasks.splice(index, 1)
  saveTasks()
  renderTasks()
}

const editTask = (index: number): void => {
  const newText = prompt("Edit task", tasks[index].text)
  if (newText !== null && newText.trim() !== "") {
      tasks[index].text = newText.trim()
      saveTasks()
      renderTasks()
  }
}

const saveTasks = (): void => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

addTaskButton.addEventListener("click", addTask)
filterSelect.addEventListener("change", renderTasks)
taskInput.addEventListener("keypress", (event: KeyboardEvent) => {
  if (event.key === "Enter") addTask()
})

renderTasks()
