import Task from "./task";
import Project from "./project";
import visualComponent from "./visualComponent";

let tasksList = [];
let projectsList = [];
export const printAll = () => {
  visualComponent.printAllProjects(projectsList);
  visualComponent.printAllTasks(tasksList);
};
export function addProjectToList(proj) {
  projectsList.push(proj);
}
export function addTaskToList(task) {
  tasksList.push(task);
}
export function removeTask(task, project) {
  if (project) {
    project.removeTask(task);
    console.log(project);
  } else {
    tasksList = tasksList.filter((elm) => elm !== task);
  }
  printAll();
  setLocalStorage();
}
export function removeProject(project) {
  projectsList = projectsList.filter((elm) => elm !== project);
  setLocalStorage();
  printAll();
}

export function setLocalStorage() {
  JSON.stringify(window.localStorage.setItem("tasksList", tasksList));
  JSON.stringify(window.localStorage.setItem("projectsList", projectsList));
}
function getLocalStorage() {
  // projectsList = JSON.parse(window.localStorage.getItem("projectsList"));
  // tasksList = JSON.parse(window.localStorage.getItem("tasksList"));
}
let task1 = new Task("my task", "my desc", new Date(2023, 12, 12), "high");
let task11 = new Task("my task", "my desc", new Date(2023, 12, 12), "high");
let task2 = new Task("my task2", "my desc", new Date(2023, 12, 12), "high");
let task3 = new Task("my task3", "my desc", new Date(2023, 12, 12), "high");

let project1 = new Project("proj", "aaaa", new Date(2023, 11, 11), "low", [
  task1,
  task2,
  task3,
]);
projectsList.push(project1);
let project2 = new Project("proj", "aaaa", new Date(2023, 11, 11), "low", [
  task1,
  task2,
  task3,
]);
projectsList.push(project2);
console.log(projectsList);
console.log(projectsList);

tasksList.push(task1);
tasksList.push(task2);
tasksList.push(task3);
tasksList.push(task11);
getLocalStorage();
printAll();
