"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashbaord"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <LoginForm />
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "user":
        return <UserDashboard />
      case "admin":
        return <AdminDashboard />
      case "super_admin":
        return <SuperAdminDashboard />
      default:
        return <UserDashboard />
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}
