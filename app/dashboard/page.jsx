"use client"

import TodoInput from "../../components/todo-input"
import TodoList from "../../components/todo-list.js"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


function Loading() {
    return <p>Loading...</p>
}

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const loggedIn = Cookies.get("logged-in")
        if (!loggedIn) router.replace("/login")
        setIsLoading(false)
    }, [])

    if (isLoading) return <Loading />

    return (
        <div className="container p-10 flex flex-col items-center justify-center mt-10 md:mt-0">
            <h1>Dashboard</h1>
            <div className="mt-10 space-y-5">
                <TodoList />
                <TodoInput />
            </div>

        </div>
    )
}
