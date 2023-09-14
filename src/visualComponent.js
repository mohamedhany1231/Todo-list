import "./style.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { format } from "date-fns";
import {
  removeProject,
  removeTask,
  addTaskToList,
  printAll,
  addProjectToList,
  setLocalStorage,
  setPrints,
  bin,
  printBin,
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
  function inputGenerator(
    required,
    form,
    input,
    type,
    placeHolder,
    isTextArea = false
  ) {
    let inputDiv = elementGenerator("div", "input-div");
    let label = elementGenerator("label", "", input);
    label.setAttribute("for", input);
    inputDiv.append(label);

    let inputElement = isTextArea
      ? elementGenerator("textarea")
      : elementGenerator("input");
    inputElement.setAttribute("id", input);
    if (required) inputElement.required = true;
    inputElement.setAttribute("id", input);

    inputElement.placeHolder = placeHolder;
    if (type) inputElement.type = type;
    inputDiv.append(inputElement);
    form.append(inputDiv);
    return inputElement;
  }
  let radioInputGenerator = (form, name, value) => {
    let inputDiv = elementGenerator("div", "input-div");
    let high = inputGenerator(true, inputDiv, "high", "radio");
    high.name = name;
    high.value = "high";
    let medium = inputGenerator(true, inputDiv, "medium", "radio");
    medium.name = name;
    medium.value = "medium";
    let low = inputGenerator(true, inputDiv, "low", "radio");
    low.name = name;
    low.value = "low";

    if (value != undefined)
      [high, medium, low].forEach((elm) => {
        if (elm.value == value) elm.check = true;
      });
    form.append(inputDiv);
  };
  // printTaskInfo responsible for creating task and project html elements
  let printTaskInfo = (
    task,
    isProject = false,
    parent = content,
    parentProject,
    inBin = false
  ) => {
    if (task === undefined) return;
    let taskInfo = elementGenerator("div", isProject ? "project" : "task");
    if (task.getState()) {
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
    let delButton = elementGenerator("button", "del-button");
    delButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    buttons.appendChild(delButton);
    delButton.addEventListener("click", function () {
      if (confirm(`are you sure you want to delete ${task.getTitle()}`)) {
        if (isProject) {
          if (inBin) bin.deleteProj(task);
          else {
            removeProject(task), bin.projects.push(task);
          }
        } else {
          if (inBin) bin.deleteTask(task);
          else {
            removeTask(task, parentProject);
            bin.tasks.push(task);
          }
        }
        setLocalStorage();
      }
    });

    if (!inBin) {
      let editButton = elementGenerator("button", "edit-button");
      editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
      buttons.appendChild(editButton);
      editButton.addEventListener("click", () => {
        if (!isProject) editTask(task, parentProject);
        else editProject(task);
      });

      let doneButton = elementGenerator("button", "done-button");
      doneButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      buttons.appendChild(doneButton);
      doneButton.addEventListener("click", () => {
        task.toggleState();
        printAll();
        setLocalStorage();
      });
      if (isProject) {
        let addTask = elementGenerator("button", "add-task");
        addTask.innerHTML = '<i class="fa-solid fa-plus"></i>';
        buttons.append(addTask);
        addTask.addEventListener("click", function () {
          createTask(task);
        });
      }
    } else {
      let recoverBtn = elementGenerator("button", "recover-button", "Recover");
      recoverBtn.addEventListener("click", () => {
        if (isProject) {
          addProjectToList(task);
          bin.deleteProj(task);
        } else {
          addTaskToList(task);
          bin.deleteTask(task);
        }
        setLocalStorage();
      });
      buttons.append(recoverBtn);
    }

    taskInfo.append(buttons);
    parent.append(taskInfo);
  };
  let printProject = (proj, parent = content, projDiv, inBin = false) => {
    if (proj === undefined) return;
    let projectDiv = projDiv
      ? projDiv
      : elementGenerator("div", "project-container");
    // PROJECT INFO
    printTaskInfo(proj, true, projectDiv, undefined, inBin);
    //tasks info
    let tasksDiv = elementGenerator("div", "tasks");
    proj.getTasks().forEach((task) => {
      printTaskInfo(task, false, tasksDiv, proj);
    });
    projectDiv.append(tasksDiv);
    parent.append(projectDiv);
  };

  let printAllProjects = (list, parent = content, inBin = false) => {
    parent.innerHTML = "";
    let projectsDiv = elementGenerator("div", "projects-div");
    let headerDiv = elementGenerator("div", "header");
    let header = elementGenerator("h2", "projects-header", "Projects");
    headerDiv.append(header);
    if (!inBin) {
      let addProjBtn = elementGenerator("button", "add-proj", "");
      addProjBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      headerDiv.append(addProjBtn);
      addProjBtn.addEventListener("click", createProject);
    }
    projectsDiv.append(headerDiv);
    list.forEach((proj) => printProject(proj, projectsDiv, undefined, inBin));
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
    inputGenerator(true, form, "title", "text").value = title;
    inputGenerator(false, form, "description", "", "description", true).value =
      desc;
    let dateInput = inputGenerator(true, form, "date", "date");
    dateInput.value = date;
    dateInput.min = format(new Date(), "yyyy-MM-dd");
    if (project instanceof Project) {
      dateInput.max = format(project.getDate(), "yyyy-MM-dd");
    }
    radioInputGenerator(form, "priority", priority);
    let header = isProject
      ? "Project form"
      : ` ${project instanceof Project ? project.getTitle() : ""} Task form `;
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
      if (!validateForm(formDiv)) return;
      let newTask = new Task(
        formDiv.querySelector("#title").value,
        formDiv.querySelector("#description").value,
        new Date(formDiv.querySelector("#date").value),
        formDiv.querySelector('[name = "priority"]').value
      );
      if (project instanceof Project) project.addTask(newTask);
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
      if (!validateForm(formDiv)) return;
      task.setTitle(formDiv.querySelector("#title").value);
      task.setDescription(formDiv.querySelector("#description").value);
      task.setDate(new Date(formDiv.querySelector("#date").value));
      task.setPriority(formDiv.querySelector('[name = "priority"]').value);
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
      if (!validateForm(formDiv)) return;
      let newProject = new Project(
        formDiv.querySelector("#title").value,
        formDiv.querySelector("#description").value,
        new Date(formDiv.querySelector("#date").value),
        formDiv.querySelector('[name = "priority"]:checked').value,
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
      if (!validateForm(formDiv)) return;

      project.setTitle(formDiv.querySelector("#title").value);
      project.setDescription(formDiv.querySelector("#description").value);
      project.setDate(new Date(formDiv.querySelector("#date").value));
      project.setPriority(
        formDiv.querySelector('[name = "priority"]:checked').value
      );
      //   rerender
      printAll();
      setLocalStorage();
    });
    formDiv.querySelector("form").append(submitBtn);
    setLocalStorage();
  };
  let printAllTasks = (
    list,
    clearParent = false,
    parent = content,
    inBin = false
  ) => {
    if (clearParent) parent.innerHTML = "";
    let tasksDiv = elementGenerator("div", "tasks-div");
    let headerDiv = elementGenerator("div", "header");
    let header = elementGenerator("h2", "tasks-header", "Tasks");
    headerDiv.append(header);
    if (!inBin) {
      let addTaskBtn = elementGenerator("button", "add-task");
      addTaskBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      headerDiv.append(addTaskBtn);
      addTaskBtn.addEventListener("click", createTask);
    }
    tasksDiv.append(headerDiv);
    list.forEach((task) =>
      printTaskInfo(task, false, tasksDiv, undefined, inBin)
    );
    parent.append(tasksDiv);
  };
  function validateForm(formDiv) {
    let inputs = formDiv.querySelectorAll("input");
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    });
    return true;
  }

  // nav bar
  document.getElementById("all-nav").addEventListener("click", () => {
    setPrints(true, true);
  });
  document.getElementById("tasks-nav").addEventListener("click", () => {
    setPrints(true, false);
  });
  document.getElementById("projects-nav").addEventListener("click", () => {
    setPrints(false, true);
  });
  document.getElementById("bin-nav").addEventListener("click", printBin);

  // bin

  return { printAllProjects, printAllTasks };
})();
export default visualComponent;
