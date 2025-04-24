import { ToolInvocation, streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

interface Message {
  role: "user" | "assistant"
  content: string
  toolInvocations?: ToolInvocation[]
}

// A mocked responses to demonstrate the assistant's functionality.
const getPrice = () => ({ value: 10.99, currency: "USD" })
// A mocked responses to demonstrate the assistant's functionality.
const getPaymentMethods = () => ["Credit Card", "PayPal", "Apple Pay"]
// A mocked responses to demonstrate the assistant's functionality.
const getOrderStatus = () => ({ status: "Shipped", estimatedDelivery: "2025-01-01" })

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return new Response("An error occurred while processing your request!", {
      status: 404,
    })
  }

  const { messages }: { messages: Message[] } = await req.json()

  const result = streamText({
    // You can use any model you want.
    // In this case, it is Gemini 2.0 Flash due to the fact that it is free.
    model: google("gemini-2.0-flash-001"),
    system:
        "You are a customer support assistant for the online store Acme Corp., which sells computer games."
        + "Your job is to respond politely and professionally only to questions related to the Acme Corp. store, its product offerings, orders, payments, refunds, customer support, and technical aspects of how the store operates."
        + "If a user asks something outside your scope, politely inform them that you can only assist with matters related to the Acme Corp. store.",
    messages,
    tools: {
      getPrice: {
        description: "Get the price of the game.",
        parameters: z.object({
          game: z.string().describe("The game to get the price for."),
        }),
        execute: async ({ game }) => {
          const price = getPrice()

          return `The ${game} costs ${new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency }).format(price.value)}.`
        },
      },
      getPaymentMethods: {
        description: "Get the supported payment methods.",
        parameters: z.object({}),
        execute: async () => {
          const paymentMethods = getPaymentMethods()

          return `Accepted forms of payment are: ${paymentMethods.join(", ")}.`
        },
      },
      getOrderStatus: {
        description: "Get the order status based on the customer's order number.",
        parameters: z.object({
          orderNumber: z.string().describe("The customer's order number."),
        }),
        execute: async ({ orderNumber }) => {
          const orderStatus = getOrderStatus()

          return `The status of order number ${orderNumber} is: ${orderStatus.status}. Estimated delivery time is: ${orderStatus.estimatedDelivery}.`
        },
      },
    },
  })

  return result.toDataStreamResponse({
    getErrorMessage: () => "An error occurred while processing your request!",
  })
}

