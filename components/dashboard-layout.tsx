"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Shield, Crown, CreditCard } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const getRoleIcon = () => {
    switch (user?.role) {
      case "user":
        return <User className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      case "super_admin":
        return <Crown className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = () => {
    switch (user?.role) {
      case "user":
        return "User"
      case "admin":
        return "Admin"
      case "super_admin":
        return "Super Admin"
      default:
        return "User"
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out Successfully",
      description: "You have been securely logged out of PayFlow.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PayFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="px-3 py-1 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="flex items-center space-x-2">
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-gray-700">{getRoleLabel()}</span>
                </div>
              </Card>
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-200 text-red-500 border border-2 border-gray-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
