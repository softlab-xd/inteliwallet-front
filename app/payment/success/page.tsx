"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { subscriptionService } from "@/lib/services/subscription.service"
import type { Payment } from "@/lib/types/subscription"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const paymentId =
    searchParams.get('paymentId') ||
    searchParams.get('payment_id') ||
    searchParams.get('id') ||
    searchParams.get('transactionId') ||
    searchParams.get('transaction_id')

  useEffect(() => {
    async function fetchPaymentStatus() {
      const allParams: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        allParams[key] = value
      })

      const debugMessage = `URL: ${window.location.href}\nParameters: ${JSON.stringify(allParams, null, 2)}`
      setDebugInfo(debugMessage)
      console.log('Payment Success Debug:', debugMessage)

      if (!paymentId) {
        setError(`Payment ID not found in URL parameters. Available params: ${Object.keys(allParams).join(', ') || 'none'}`)
        setLoading(false)
        return
      }

      console.log('Found payment ID:', paymentId)

      try {
        const paymentData = await subscriptionService.getPaymentById(paymentId)
        setPayment(paymentData)
      } catch (err) {
        console.error("Error fetching payment:", err)
        setError("Failed to fetch payment details")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentStatus()
  }, [paymentId, searchParams])

  const handleGoToDashboard = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-500/10 p-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Payment Error</CardTitle>
            <CardDescription className="text-center">
              {error || "Unable to verify payment status"}
            </CardDescription>
          </CardHeader>

          {debugInfo && (
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm">Debug Information:</h3>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                  {debugInfo}
                </pre>
                <p className="text-xs text-muted-foreground mt-4">
                  Please share this information with support if the issue persists.
                </p>
              </div>
            </CardContent>
          )}

          <CardFooter className="flex justify-center">
            <Button onClick={handleGoToDashboard} variant="outline">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const isSuccess = payment.status === 'paid'
  const isPending = payment.status === 'pending' || payment.status === 'processing'
  const isFailed = payment.status === 'failed' || payment.status === 'expired' || payment.status === 'canceled'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-4 ${
              isSuccess ? 'bg-green-500/10' :
              isPending ? 'bg-yellow-500/10' :
              'bg-red-500/10'
            }`}>
              {isSuccess && <CheckCircle2 className="h-12 w-12 text-green-500" />}
              {isPending && <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />}
              {isFailed && <XCircle className="h-12 w-12 text-red-500" />}
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            {isSuccess && "Payment Successful!"}
            {isPending && "Payment Pending"}
            {isFailed && "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess && "Your subscription has been activated successfully"}
            {isPending && "We're waiting for payment confirmation"}
            {isFailed && "There was an issue processing your payment"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">R$ {payment.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold uppercase">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-semibold ${
                isSuccess ? 'text-green-500' :
                isPending ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {payment.status.toUpperCase()}
              </span>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid At:</span>
                <span className="font-semibold">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {isPending && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Your payment is being processed. You will receive a confirmation once it's complete.
              </p>
            </div>
          )}

          {isFailed && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                Please try again or contact support if the issue persists.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleGoToDashboard}
            className="w-full"
            size="lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
