import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sleep } from "../lib/utils"

export async function generateTodos() {
    const resp = await fetch('https://dummyjson.com/todos?limit=3')
    return await resp.json()
}

function updateTodo(oldData, newTodo) {
    const target = oldData.todos.find(t => t.id === newTodo.id)
    if (!target) return { ...oldData }
    target.completed = newTodo.completed
    return { ...oldData }
}

function deleteTodo(oldData, todo) {
    const newTodos = oldData.todos.filter(t => t.id !== todo.id)
    return { ...oldData, todos: newTodos }
}

export default function TodoList() {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: ['todos'], queryFn: generateTodos })
    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await sleep(1000)
            return data
        },
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] })
            if (data.type === "update") {
                queryClient.setQueryData(['todos'], (oldTodos) => updateTodo(oldTodos, data))
            } else if (data.type === "delete") {
                queryClient.setQueryData(['todos'], (oldTodos) => deleteTodo(oldTodos, data))
            }
            return queryClient.getQueryData(['todos'])
        },
    })
    if (isLoading) return <p>Loading...</p>
    const todos = data.todos
    if (!todos.length) return <p>No todo. Please create one!</p>
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-bold">Todo List</h1>
            <ul ref={e => {
                if (e) {
                    e.scrollTop = e.scrollHeight
                }
            }} className="flex flex-col gap-6 max-h-[400px] overflow-y-auto">
                {todos.map(todo => (
                    <TodoItem
                        id={todo.id}
                        text={todo.todo}
                        key={todo.id}
                        completed={todo.completed}
                        onChecked={(newValue) => {
                            mutate({
                                type: "update",
                                ...newValue
                            })
                        }}
                        onDelete={(todo) => {
                            mutate({
                                type: "delete",
                                ...todo
                            })
                        }}

                    />
                ))}
            </ul>
        </div>
    )
}

function TodoItem({ text, completed, onChecked, onDelete, id }) {
    return (
        <div className="flex gap-2 items-center">
            <input type="checkbox" onChange={(e) => onChecked({ id, completed: e.target.checked })} checked={completed} />
            <li>{text}</li>
            <Button onClick={() => onDelete({ id })} variant="outline" className="border-destructive text-destructive">
                <Trash />
            </Button>
        </div>
    )

}
