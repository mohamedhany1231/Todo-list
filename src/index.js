import Task from "./task";
import Project from "./project";
import visualComponent from "./visualComponent";

let tasksList = [];
let projectsList = [];
export let bin = {
  tasks: [],
  projects: [],
  deleteProj(project) {
    this.projects = this.projects.filter((proj) => proj != project);
    printBin();
  },
  deleteTask(task) {
    this.tasks = this.tasks.filter((elm) => elm != task);
    printBin();
  },
};
let printTasks = true;
let printProjects = true;

export const printAll = () => {
  if (printProjects) visualComponent.printAllProjects(projectsList);
  if (printTasks) visualComponent.printAllTasks(tasksList, !printProjects);
};
export const setPrints = (tasks, projects) => {
  printTasks = tasks;
  printProjects = projects;
  printAll();
};
export function printBin() {
  visualComponent.printAllProjects(bin.projects, undefined, true);
  visualComponent.printAllTasks(bin.tasks, false, undefined, true);
}
export function addProjectToList(proj) {
  projectsList.push(proj);
}
export function addTaskToList(task) {
  tasksList.push(task);
}
export function removeTask(task, project) {
  if (project) {
    project.removeTask(task);
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
  function convertTasksToJson(list) {
    let newList = [...list];
    newList.map((task) => {
      return {
        title: task.getTitle(),
        isDone: task.getState(),
        date: task.getDate(),
        description: task.getDescription(),
        priority: task.getPriority(),
      };
    });
    return newList;
  }

  // tasks

  window.localStorage.setItem(
    "tasksList",
    JSON.stringify(convertTasksToJson(tasksList))
  );

  function convertProjectsToJson(list) {
    console.log(list);
    let newList = [...list];
    newList.map((proj) => {
      return {
        title: proj.getTitle(),
        isDone: proj.getState(),
        date: proj.getDate(),
        description: proj.getDescription(),
        priority: proj.getPriority(),
        tasksArr: convertTasksToJson(proj.getTasks()),
      };
    });
    return newList;
  }

  // projects
  window.localStorage.setItem(
    "projectsList",
    JSON.stringify(convertProjectsToJson(projectsList))
  );

  // bin
  window.localStorage.setItem(
    "binTasks",
    JSON.stringify(convertTasksToJson(bin.tasks))
  );
  window.localStorage.setItem(
    "binProjects",
    JSON.stringify(convertProjectsToJson(bin.projects))
  );
}
function getLocalStorage() {
  function convertJsonToTask(task) {
    return new Task(
      task.title,
      task.description,
      new Date(task.date),
      task.priority,
      task.isDone
    );
  }
  tasksList =
    JSON.parse(window.localStorage.getItem("tasksList"))?.map((task) => {
      return convertJsonToTask(task);
    }) || [];
  function convertJsonToProject(proj) {
    let newProj = new Project(
      proj.title,
      proj.description,
      new Date(proj.date),
      proj.priority,
      proj.tasksArr.map((task) => convertJsonToTask(task)),
      proj.isDone
    );
    return newProj;
  }
  projectsList =
    JSON.parse(window.localStorage.getItem("projectsList"))?.map((proj) => {
      return convertJsonToProject(proj);
    }) || [];
  // bin
  bin.tasks =
    JSON.parse(window.localStorage.getItem("binTasks"))?.map((task) => {
      return convertJsonToTask(task);
    }) || [];
  bin.projects =
    JSON.parse(window.localStorage.getItem("binProjects"))?.map((proj) => {
      return convertJsonToProject(proj);
    }) || [];

  // tasksList.filter((elm) => elm);
  // projectsList.filter((elm) => elm);
  // bin.projects.filter((elm) => elm);
  // bin.tasks.filter((elm) => elm);
}

getLocalStorage();

printAll();
console.log(projectsList, tasksList, bin);
