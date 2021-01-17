export interface Task {
    id: Number;
    itemName: String;
}


export interface TaskList {
    task: Array<Task>
}