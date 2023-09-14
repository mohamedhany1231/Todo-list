export default class Task {
  constructor(title, description, date, priority, isDone = false) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.isDone = isDone;
  }
  toggleState = () => {
    this.isDone = !this.isDone;
  };
  getState = () => this.isDone;
  getTitle = () => this.title;
  getDescription = () => this.description;
  getDate = () => this.date;
  getPriority = () => this.priority;
  setTitle = (title) => {
    this.title = title;
  };
  setDescription = (description) => {
    this.description = description;
  };
  setPriority = (priority) => {
    this.priority = priority;
  };
  setDate = (date) => {
    this.date = date;
  };
}
