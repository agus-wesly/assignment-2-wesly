import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function sleep(time = 1000) {
    return new Promise(res => {
        setTimeout(() => { res(null) }, time)
    })
}
