import "./style.css";
import { compareAsc, format } from "date-fns";
import { removeProject, removeTask } from ".";
import Task from "./task";

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
  }
  // printTaskInfo responsible for creating task and project html elements
  let printTaskInfo = (
    task,
    isProject = false,
    parent = content,
    parentProject
  ) => {
    let taskInfo = elementGenerator("div", isProject ? "project" : "task");

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

    let doneButton = elementGenerator("button", "done-button", "Done");
    buttons.appendChild(doneButton);
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
    list.forEach((proj) => printProject(proj, projectsDiv));
    parent.append(projectsDiv);
  };

  let getTaskForm = (project) => {
    let formDiv = elementGenerator("div", "form-div");
    let maskDiv = elementGenerator("div", "mask");
    formDiv.append(maskDiv);
    let form = elementGenerator("form", "task-form");
    inputGenerator(form, "title", "text");
    inputGenerator(form, "description", "", "description", true);
    inputGenerator(form, "date", "date");
    inputGenerator(form, "priority", "text");
    form.prepend(
      elementGenerator(
        "h2",
        "form-header",
        `Task form for${project.getTitle()}`
      )
    );
    formDiv.append(form);
    content.append(formDiv);
    return formDiv;
  };
  let createTask = (project) => {
    let formDiv = getTaskForm(project);

    let submitBtn = elementGenerator("button", "submit-btn", "submit");
    submitBtn.type = "button";
    submitBtn.addEventListener("click", function () {
      project.addTask(
        new Task(
          formDiv.querySelector("#title").value,
          formDiv.querySelector("#description").value,
          new Date(formDiv.querySelector("#date").value),
          formDiv.querySelector("#priority").value
        )
      );

      //   rerender
      removeProject();
    });
    formDiv.querySelector("form").append(submitBtn);
  };

  return { printAllProjects };
})();
export default visualComponent;
