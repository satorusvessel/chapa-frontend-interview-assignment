"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, User, Shield, Crown } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Payment Service Provider</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="px-3 py-1">
                <div className="flex items-center space-x-2">
                  {getRoleIcon()}
                  <span className="text-sm font-medium">{getRoleLabel()}</span>
                </div>
              </Card>
              <div className="text-sm text-gray-700">Welcome, {user?.name}</div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
