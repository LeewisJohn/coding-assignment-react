export const STATUS: any[] = [{
    id: 1,
    name: "In complete",
    value: false,
    order: 0
}, {
    id: 2,
    name: "Complete",
    value: true,
    order: 1,
}]

export const UNASSIGN = {
    name: "Unassign",
    value: -1,
}

export const UPDATE_TICKET_TYPE = {
    Title: 'title',
    Statue: 'status',
    Desc: 'description',
    Assignee: 'assignee',
    AddAssignee: 'add assignee',
    RemoveAssignee: 'remove assignee',
} as const;