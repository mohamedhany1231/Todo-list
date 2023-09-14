import Task from "./task";
export default class Project extends Task {
  constructor(title, description, date, priority, tasksArr, isDone = false) {
    super(title, description, date, priority, isDone);

    this.tasksArr = tasksArr;
  }
  getTasks() {
    return this.tasksArr;
  }
  addTask(task) {
    console.log(task.getTitle());
    this.tasksArr.push(task);
  }
  removeTask(task) {
    this.tasksArr = this.tasksArr.filter((elm) => elm != task);
  }
}
