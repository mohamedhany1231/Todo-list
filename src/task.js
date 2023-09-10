export default class Task {
  constructor(title, description, date, priority) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.isDone = false;
  }
  toggleState = () => {
    this.isDone = !this.isDone;
  };
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
