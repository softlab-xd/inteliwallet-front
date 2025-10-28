"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle, ArrowRight, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscriptionService } from "@/lib/services/subscription.service"
import { userService } from "@/lib/services/user.service"
import type { Payment } from "@/lib/types/subscription"
import type { User } from "@/lib/types/user"

function PaymentCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [user, setUser] = useState<User | null>(null)
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
      console.log('Payment Complete Debug:', debugMessage)

      if (!paymentId) {
        setError(`Payment ID not found in URL parameters. Available params: ${Object.keys(allParams).join(', ') || 'none'}`)
        setLoading(false)
        return
      }

      console.log('Found payment ID:', paymentId)

      try {
        const paymentData = await subscriptionService.getPaymentById(paymentId)
        setPayment(paymentData)

        if (paymentData.status === 'paid') {
          try {
            const userData = await userService.getProfile()
            setUser(userData)

            localStorage.setItem('user', JSON.stringify(userData))
          } catch (userErr) {
            console.error("Error fetching user profile:", userErr)
          }

          setTimeout(() => {
            router.push('/')
          }, 3000)
        }
      } catch (err) {
        console.error("Error fetching payment:", err)
        setError("Failed to fetch payment details")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentStatus()
  }, [paymentId, router])

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
              <p className="text-muted-foreground">Processing your payment...</p>
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

  const getPlanDetails = () => {
    const planType = user?.plan || (payment.amount === 5 ? 'standard' : payment.amount === 20 ? 'plus' : null)

    if (planType === 'standard') {
      return {
        name: 'Standard',
        key: 'standard' as const,
        icon: <Zap className="h-6 w-6" />,
        color: 'from-blue-500 to-indigo-500',
        features: [
          '6 active goals',
          'Create up to 3 challenges',
          'Join unlimited challenges',
          'Complete streaks system',
          'Priority support'
        ]
      }
    } else if (planType === 'plus') {
      return {
        name: 'Plus',
        key: 'plus' as const,
        icon: <Crown className="h-6 w-6" />,
        color: 'from-amber-500 to-yellow-500',
        features: [
          '10 active goals',
          'Create up to 6 challenges',
          'Join unlimited challenges',
          'Complete streaks system',
          'Priority support',
          'Early access to features'
        ]
      }
    }
    return null
  }

  const planDetails = getPlanDetails()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-4 ${
              isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              {isSuccess ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-center text-3xl">
            {isSuccess ? "Payment Complete!" : "Payment Incomplete"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isSuccess
              ? "Your subscription has been successfully activated"
              : "There was an issue completing your payment"}
          </CardDescription>

          {isSuccess && user && (
            <div className="flex justify-center mt-4">
              <Badge className={`text-base px-6 py-2 ${
                user.plan === 'plus'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : user.plan === 'standard'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  : 'bg-gray-500'
              } text-white border-0`}>
                {user.plan === 'plus' && <Crown className="h-5 w-5 mr-2" />}
                {user.plan === 'standard' && <Zap className="h-5 w-5 mr-2" />}
                {user.plan.toUpperCase()} PLAN
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-semibold">R$ {payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <span className="font-semibold uppercase">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={
                  isSuccess ? 'bg-green-500' : 'bg-red-500'
                }>
                  {payment.status.toUpperCase()}
                </Badge>
              </div>
              {payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed At:</span>
                  <span className="font-semibold">
                    {new Date(payment.paidAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isSuccess && planDetails && (
            <div className={`bg-gradient-to-br ${planDetails.color} rounded-lg p-6 text-white`}>
              <div className="flex items-center gap-3 mb-4">
                {planDetails.icon}
                <h3 className="text-2xl font-bold">{planDetails.name} Plan</h3>
              </div>
              <div className="space-y-2">
                {planDetails.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                You will be redirected to your dashboard in a few seconds...
              </p>
            </div>
          )}

          {!isSuccess && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-300 text-center">
                Please try again or contact our support team for assistance.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={handleGoToDashboard}
            className="w-full"
            size="lg"
            variant={isSuccess ? "default" : "outline"}
          >
            {isSuccess ? "Go to Dashboard Now" : "Return to Dashboard"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PaymentCompletePage() {
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
      <PaymentCompleteContent />
    </Suspense>
  )
}
