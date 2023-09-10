import Task from "./task";
import Project from "./project";
import visualComponent from "./visualComponent";

let tasksList = [];
export function removeTask(task, project) {
  if (project) {
    project.removeTask(task);
    console.log(project);

    visualComponent.printAllProjects(projectsList);
  } else {
    tasksList = tasksList.filter((elm) => elm !== task);
  }
  setLocalStorage();
}
let projectsList = [];
export function removeProject(project) {
  projectsList = projectsList.filter((elm) => elm !== project);
  setLocalStorage();
  visualComponent.printAllProjects(projectsList);
}

function setLocalStorage() {
  window.localStorage.setItem("tasksList", tasksList);
  window.localStorage.setItem("projectsList", projectsList);
}
let task1 = new Task("my task", "my desc", new Date(2023, 12, 12), "high");
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

// let projs = window.localStorage.getItem("projectsList");

visualComponent.printAllProjects(projectsList);
