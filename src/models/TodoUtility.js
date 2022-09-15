export function isTodoEqual(todo1, todo2) {
    return todo1.id === todo2.id &&
        todo1.title.trim() === todo2.title &&
        todo1.description === todo2.description &&
        todo1.urgency === todo2.urgency &&
        todo1.completed === todo2.completed
}