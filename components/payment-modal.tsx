"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy, Loader2, QrCode, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { subscriptionService } from "@/lib/services/subscription.service"
import type { Payment } from "@/lib/types/subscription"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentData: Payment | null
  onPaymentSuccess?: () => void
}

export function PaymentModal({ open, onOpenChange, paymentData, onPaymentSuccess }: PaymentModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [pollingActive, setPollingActive] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<Payment['status']>(paymentData?.status || 'pending')

  useEffect(() => {
    if (!paymentData || !open) {
      setPollingActive(false)
      return
    }

    setPollingActive(true)
    setPaymentStatus(paymentData.status)

    const pollInterval = setInterval(async () => {
      try {
        const updatedPayment = await subscriptionService.getPaymentById(paymentData.id)
        setPaymentStatus(updatedPayment.status)

        if (updatedPayment.status === 'paid') {
          clearInterval(pollInterval)
          setPollingActive(false)
          toast({
            title: "Payment Confirmed!",
            description: "Your subscription is now active",
          })

          setTimeout(() => {
            if (onPaymentSuccess) {
              onPaymentSuccess()
            } else {
              onOpenChange(false)
            }
          }, 2000)
        } else if (
          updatedPayment.status === 'failed' ||
          updatedPayment.status === 'expired' ||
          updatedPayment.status === 'canceled'
        ) {
          clearInterval(pollInterval)
          setPollingActive(false)
          toast({
            title: "Payment Failed",
            description: "Please try again or contact support",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Error polling payment status:", err)
      }
    }, 5000)

    const maxPollingTime = setTimeout(() => {
      clearInterval(pollInterval)
      setPollingActive(false)
    }, 300000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(maxPollingTime)
      setPollingActive(false)
    }
  }, [paymentData, open, onOpenChange, onPaymentSuccess, toast])

  const handleCopyPixCode = async () => {
    if (!paymentData?.pixCode) return

    try {
      await navigator.clipboard.writeText(paymentData.pixCode)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "PIX code copied to clipboard",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const formatExpiry = (expiresAt: string) => {
    const date = new Date(expiresAt)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      case 'expired':
        return <Badge className="bg-gray-500">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (!paymentData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>PIX Payment</DialogTitle>
            {getStatusBadge(paymentStatus)}
          </div>
          <DialogDescription>
            Scan the QR code or copy the PIX code to complete your payment
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'paid' ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-500/10 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Payment Confirmed!</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription is now active
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-bold">
                    R$ {paymentData.amount.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {paymentData.pixQrCode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <QrCode className="h-4 w-4" />
                  <span>Scan QR Code</span>
                </div>
                <div className="flex justify-center">
                  <div className="border-4 border-primary/20 rounded-lg p-2 bg-white">
                    <img
                      src={paymentData.pixQrCode}
                      alt="PIX QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentData.pixCode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Copy className="h-4 w-4" />
                  <span>Or copy the PIX code</span>
                </div>
                <div className="relative">
                  <div className="bg-muted p-3 rounded-lg">
                    <code className="text-xs break-all font-mono">
                      {paymentData.pixCode}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopyPixCode}
                    size="sm"
                    className="absolute top-2 right-2"
                    variant={copied ? "default" : "secondary"}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires at:</span>
                  </div>
                  <span className="font-medium">
                    {formatExpiry(paymentData.expiresAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {pollingActive && paymentStatus === 'pending' && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Waiting for payment confirmation...</span>
              </div>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How to pay:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your bank app</li>
                <li>Choose PIX payment option</li>
                <li>Scan the QR code or paste the code</li>
                <li>Confirm the payment</li>
              </ol>
              <p className="text-xs pt-2">
                Your subscription will be activated automatically after payment confirmation.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
