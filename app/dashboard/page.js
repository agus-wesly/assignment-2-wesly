"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const loggedIn = Cookies.get("logged-in")
        if (!loggedIn) router.replace("/login")
        setIsLoading(false)
    }, [])

    return isLoading ? <p>Loading...</p> : (
        <p>Dashboard</p>
    )
}
