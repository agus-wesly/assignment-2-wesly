"use client"

import * as React from "react"

import { cn, sleep } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../components/ui/form"
import Cookies from "js-cookie"
import { useToast } from "./hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
})


export function LoginForm({ className, ...props }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { toast } = useToast()
    const router = useRouter()


    const [isLoading, setIsLoading] = React.useState(false)

    async function onSubmit(values) {
        setIsLoading(true)
        await sleep()
        try {
            const userData = Cookies.get("user")
            if (!userData) {
                toast({
                    variant: "destructive",
                    title: "Username or password is incorrect",
                })
                throw new Error("")
            }
            const user = JSON.parse(userData)
            if (user.email != values.email || user.password != values.password) {
                toast({
                    variant: "destructive",
                    title: "Username or password is incorrect",
                })
                throw new Error("")
            }
            Cookies.set("logged-in", "true")
            router.replace("/dashboard")

        } catch (e) {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid gap-1">
                                    <Label htmlFor="email">
                                        Email
                                    </Label>
                                    <FormControl>

                                        <Input
                                            {...field}
                                        // id="email"
                                        // placeholder="name@example.com"
                                        // type="email"
                                        // autoCapitalize="none"
                                        // autoComplete="email"
                                        // autoCorrect="off"
                                        // disabled={isLoading}
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />


                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem className="grid gap-1">
                                <Label htmlFor="password">
                                    Password

                                </Label>
                                <FormControl>

                                    <Input
                                        {...field}
                                        type="password"
                                    // placeholder="Enter your password"
                                    // id="password"
                                    // type="password"
                                    // disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>


                        )} />
                        <Button disabled={isLoading} type="submit">
                            {isLoading ? "Loading..." : "Register"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
