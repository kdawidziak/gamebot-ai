"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Send } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useChat } from "@ai-sdk/react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { cn, toVisibleTime, toVisibleDate } from "@/lib/utils"

const FormSchema = z.object({
  message: z.string().trim().min(1, {
    message: "Message is required.",
  }),
})

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  })

  const { messages, append } = useChat({
    maxSteps: 2,
    initialMessages: [
      {
        id: "initial-message-id",
        role: "assistant",
        content: "Hi, how can I help you today?",
      },
    ],
  })

  const [isVisible, setIsVisible] = useState(false)

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    form.reset()

    try {
      await append({
        role: "user",
        content: values.message,
      })
    } catch (error) {
      console.error("Cannot send message", error)
    }
  }

  useEffect(() => {
    // Just to simulate the opening of the chat with a cool animation.
    setTimeout(() => {
      setIsVisible(true)
    }, 1000)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div className="space-x-2 flex flex-row items-center">
                  <Avatar>
                    <AvatarImage src="http://localhost:3000/icon2.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium leading-none">Gamebot AI</p>
                    <p className="text-sm text-muted-foreground">support@gamebot.ai</p>
                  </div>
                </div>

                <ThemeToggle />
              </CardHeader>

              <CardContent className="space-y-4 overflow-y-auto overflow-x-hidden h-96 border-y py-6">
                <p suppressHydrationWarning className="text-nowrap text-sm text-muted-foreground text-center">{toVisibleDate(messages[0].createdAt)}</p>

                {messages.map((message, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={index}
                    className={cn(
                      "flex flex-col gap-2",
                      message.role === "user"
                        ? "items-end"
                        : "items-start",
                    )}>
                    <p
                      className={cn(
                        "flex-1 w-max max-w-[75%] rounded-lg px-3 py-2 text-sm wrap-normal my-1",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}>
                      {message.content}
                    </p>

                    {index === messages.length - 1 && (
                      <span suppressHydrationWarning className="text-xs px-1 text-muted-foreground">Sent {toVisibleTime(message.createdAt)}</span>
                    )}
                  </motion.div>
                ))}

                <div ref={chatEndRef} />
              </CardContent>

              <CardFooter>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full space-x-2">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Type your message..." autoComplete="off" {...field} />
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="outline">
                      <Send /> Send
                    </Button>
                  </form>
                </Form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
