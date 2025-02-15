import { Input } from "../components/ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";


function addTodo(oldData, newData) {
    const newTodo = { id: Date.now(), completed: false, todo: newData.todo }
    const oldTodos = oldData.todos
    const newTodos = [...oldTodos, newTodo]
    return { ...oldData, todos: newTodos }
}

export default function TodoInput() {
    const inputRef = useRef(null)
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await sleep(1000)
            return data
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] })
            if (newData.type === "add") {
                queryClient.setQueryData(['todos'], (oldTodos) => addTodo(oldTodos, newData))
            }
            return queryClient.getQueryData(['todos'])
        },
    })

    return (
        <div>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <Input ref={inputRef} />
                <Button type="submit" onClick={() => {
                    if(!inputRef.current.value) return
                    mutate({ type: "add", todo: inputRef.current.value })
                    inputRef.current.value = ""
                    inputRef.current.focus()
                }}>
                    Submit
                </Button>
            </form>
        </div>
    )

}
