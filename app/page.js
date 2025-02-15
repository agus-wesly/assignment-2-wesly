"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        const loggedIn = Cookies.get("logged-in")
        if (!loggedIn) {
            router.replace("/login")
        } else {
            router.replace("/dashboard")
        }
    })
    return (
        <>
            <p>Loading...</p>
        </>
    )
}
