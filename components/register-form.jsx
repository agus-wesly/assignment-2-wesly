"use client"

import * as React from "react"

import { cn, sleep } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
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
import { useRouter } from "next/navigation"
import { useToast } from "./hooks/use-toast"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
})




export function RegisterForm({ className, ...props }) {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })


    const [isLoading, setIsLoading] = React.useState(false)

    async function onSubmit(values) {
        setIsLoading(true)
        Cookies.set("user", JSON.stringify(values))
        await sleep()
        toast({
            description: "Register success, Please log in",
        })
        router.replace("/login")
        setIsLoading(false)
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
                                            placeholder="name@example.com"
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
                                        placeholder="Enter your password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>


                        )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <div className="grid gap-1">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Enter your confirm password..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
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
