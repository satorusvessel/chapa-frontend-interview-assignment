"use client"

import { useState, useEffect } from "react"
import { mockApi, type PaymentSummary } from "@/services/mock-api"
import type { User } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, Activity, Loader2, UserCheck, UserX } from "lucide-react"

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, summaryData] = await Promise.all([mockApi.getAllUsers(), mockApi.getPaymentSummary()])
      setUsers(usersData.filter((u) => u.role === "user"))
      setPaymentSummary(summaryData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    setUpdatingUser(userId)
    try {
      const updatedUser = await mockApi.toggleUserStatus(userId)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)))
    } catch (error) {
      console.error("Failed to update user status:", error)
    } finally {
      setUpdatingUser(null)
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.isActive).length
  const totalVolume = paymentSummary.reduce((sum, p) => sum + p.totalSent + p.totalReceived, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total processed</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">User activation rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>${user.walletBalance?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleUserStatus(user.id)}
                      disabled={updatingUser === user.id}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
                    >
                      {updatingUser === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.isActive ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Overview of user payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Total Sent</TableHead>
                <TableHead>Total Received</TableHead>
                <TableHead>Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentSummary.map((summary) => (
                <TableRow key={summary.userId}>
                  <TableCell className="font-medium">{summary.userName}</TableCell>
                  <TableCell className="text-red-600">${summary.totalSent.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600">${summary.totalReceived.toFixed(2)}</TableCell>
                  <TableCell>{summary.transactionCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
