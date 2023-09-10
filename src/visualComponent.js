import "./style.css";
import { compareAsc, format } from "date-fns";
import {
  removeProject,
  removeTask,
  addTaskToList,
  printAll,
  addProjectToList,
  setLocalStorage,
} from ".";
import Task from "./task";
import Project from "./project";

const visualComponent = (() => {
  let content = document.getElementById("content");

  function elementGenerator(element, className, text = "") {
    let output = document.createElement(element);
    if (className) output.classList.add(className);
    output.innerText = text;
    return output;
  }
  function inputGenerator(form, input, type, placeHolder, isTextArea = false) {
    let inputDiv = elementGenerator("div", "input-div");
    inputDiv.append(elementGenerator("label", "", input));

    let inputElement = isTextArea
      ? elementGenerator("textarea")
      : elementGenerator("input");
    inputElement.setAttribute("id", input);
    inputElement.placeHolder = placeHolder;
    if (type) inputElement.type = type;
    inputDiv.append(inputElement);
    form.append(inputDiv);
    return inputElement;
  }
  // printTaskInfo responsible for creating task and project html elements
  let printTaskInfo = (
    task,
    isProject = false,
    parent = content,
    parentProject
  ) => {
    let taskInfo = elementGenerator("div", isProject ? "project" : "task");
    if (task.isDone) {
      if (isProject) parent.classList.add("completed");
      else taskInfo.classList.add("completed");
    }
    let taskTitle = elementGenerator("h2", "title", task.getTitle());
    taskInfo.append(taskTitle);

    let taskDescription = elementGenerator(
      "p",
      "description",
      task.getDescription()
    );
    taskInfo.append(taskDescription);

    let taskDate = elementGenerator(
      "p",
      "date",
      format(task.getDate(), "yyyy-MM-dd")
    );
    taskInfo.append(taskDate);

    let taskPriority = elementGenerator("p", "priority", task.getPriority());
    taskInfo.append(taskPriority);

    let buttons = elementGenerator("div", "buttons");
    let delButton = elementGenerator("button", "del-button", "Delete");
    buttons.appendChild(delButton);
    delButton.addEventListener("click", function () {
      if (isProject) removeProject(task);
      else removeTask(task, parentProject);
    });

    let editButton = elementGenerator("button", "edit-button", "Edit");
    buttons.appendChild(editButton);
    editButton.addEventListener("click", () => {
      if (!isProject) editTask(task, parentProject);
      else editProject(task);
    });

    let doneButton = elementGenerator("button", "done-button", "Done");
    buttons.appendChild(doneButton);
    doneButton.addEventListener("click", () => {
      task.toggleState();
      printAll();
      setLocalStorage();
    });
    if (isProject) {
      let addTask = elementGenerator("button", "add-task", "Add Task");
      buttons.append(addTask);
      addTask.addEventListener("click", function () {
        createTask(task);
      });
    }

    taskInfo.append(buttons);
    parent.append(taskInfo);
  };

  let printProject = (proj, parent = content, projDiv) => {
    let projectDiv = projDiv
      ? projDiv
      : elementGenerator("div", "project-container");
    // PROJECT INFO
    printTaskInfo(proj, true, projectDiv);
    //tasks info
    let tasksDiv = elementGenerator("div", "tasks");
    proj.getTasks().forEach((task) => {
      printTaskInfo(task, false, tasksDiv, proj);
    });
    projectDiv.append(tasksDiv);
    parent.append(projectDiv);
  };

  let printAllProjects = (list, parent = content) => {
    parent.innerHTML = "";
    let projectsDiv = elementGenerator("div", "projects-div");
    let addProjBtn = elementGenerator("button", "add-proj", "New Project");
    projectsDiv.append(addProjBtn);
    addProjBtn.addEventListener("click", createProject);

    list.forEach((proj) => printProject(proj, projectsDiv));
    parent.append(projectsDiv);
  };

  let getTaskForm = (
    project,
    isProject = false,
    title = "",
    desc = "",
    date,
    priority = ""
  ) => {
    let formDiv = elementGenerator("div", "form-div");
    let maskDiv = elementGenerator("div", "mask");
    formDiv.append(maskDiv);
    let form = elementGenerator("form", "task-form");
    inputGenerator(form, "title", "text").value = title;
    inputGenerator(form, "description", "", "description", true).value = desc;
    inputGenerator(form, "date", "date").value = date;
    inputGenerator(form, "priority", "text").value = priority;
    let header = isProject
      ? "Project form"
      : `Task form ${project.getTitle() || ""}`;
    form.prepend(elementGenerator("h2", "form-header", header));
    formDiv.append(form);
    content.append(formDiv);
    return formDiv;
  };
  let createTask = (project) => {
    let formDiv = getTaskForm(project);
    let submitBtn = elementGenerator("button", "submit-btn", "submit");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      let newTask = new Task(
        formDiv.querySelector("#title").value,
        formDiv.querySelector("#description").value,
        new Date(formDiv.querySelector("#date").value),
        formDiv.querySelector("#priority").value
      );
      if (project) project.addTask(newTask);
      else addTaskToList(newTask);
      //   rerender
      printAll();
      setLocalStorage();
    });
    formDiv.querySelector("form").append(submitBtn);
  };
  let editTask = (task, project) => {
    let formDiv = getTaskForm(
      project,
      false,
      task.getTitle(),
      task.getDescription(),
      format(task.getDate(), "yyyy-MM-dd"),
      task.getPriority()
    );
    let submitBtn = elementGenerator("button", "submit-btn", "submit");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      task.setTitle(formDiv.querySelector("#title").value);
      task.setDescription(formDiv.querySelector("#description").value);
      task.setDate(new Date(formDiv.querySelector("#date").value));
      task.setPriority(formDiv.querySelector("#priority").value);
      //   rerender
      printAll();
      setLocalStorage();
    });
    formDiv.querySelector("form").append(submitBtn);
  };
  let createProject = () => {
    let formDiv = getTaskForm("", true);
    let submitBtn = elementGenerator("button", "submit-btn", "submit");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      let newProject = new Project(
        formDiv.querySelector("#title").value,
        formDiv.querySelector("#description").value,
        new Date(formDiv.querySelector("#date").value),
        formDiv.querySelector("#priority").value,
        []
      );
      addProjectToList(newProject);

      //   rerender
      printAll();
      setLocalStorage();
    });
    formDiv.querySelector("form").append(submitBtn);
    setLocalStorage();
  };
  let editProject = (project) => {
    let formDiv = getTaskForm(
      project,
      true,
      project.getTitle(),
      project.getDescription(),
      format(project.getDate(), "yyyy-MM-dd"),
      project.getPriority()
    );
    let submitBtn = elementGenerator("button", "submit-btn", "submit");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      project.setTitle(formDiv.querySelector("#title").value);
      project.setDescription(formDiv.querySelector("#description").value);
      project.setDate(new Date(formDiv.querySelector("#date").value));
      project.setPriority(formDiv.querySelector("#priority").value);
      //   rerender
      printAll();
      setLocalStorage();
    });
    formDiv.querySelector("form").append(submitBtn);
    setLocalStorage();
  };
  let printAllTasks = (list, clearParent = false, parent = content) => {
    if (clearParent) parent.innerHTML = "";
    let tasksDiv = elementGenerator("div", "tasks-div");
    let addTaskBtn = elementGenerator("button", "add-task", "New Task");
    tasksDiv.append(addTaskBtn);
    addTaskBtn.addEventListener("click", function () {
      createTask();
    });
    list.forEach((task) => printTaskInfo(task, false, tasksDiv));
    parent.append(tasksDiv);
  };

  return { printAllProjects, printAllTasks };
})();
export default visualComponent;
