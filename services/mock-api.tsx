import type { User } from "@/contexts/auth-context"

export interface Transaction {
  id: string
  amount: number
  type: "sent" | "received"
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  recipient?: string
}

export interface PaymentSummary {
  userId: string
  userName: string
  totalSent: number
  totalReceived: number
  transactionCount: number
}

export interface SystemStats {
  totalPayments: number
  activeUsers: number
  totalVolume: number
  pendingTransactions: number
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 250.0,
    type: "sent",
    description: "Payment to Alice Johnson",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    recipient: "Alice Johnson",
  },
  {
    id: "2",
    amount: 500.0,
    type: "received",
    description: "Payment from Bob Smith",
    date: "2024-01-14T15:45:00Z",
    status: "completed",
  },
  {
    id: "3",
    amount: 75.5,
    type: "sent",
    description: "Utility Bill Payment",
    date: "2024-01-13T09:15:00Z",
    status: "completed",
    recipient: "Electric Company",
  },
  {
    id: "4",
    amount: 1000.0,
    type: "received",
    description: "Salary Payment",
    date: "2024-01-12T12:00:00Z",
    status: "completed",
  },
  {
    id: "5",
    amount: 150.0,
    type: "sent",
    description: "Online Shopping",
    date: "2024-01-11T16:20:00Z",
    status: "pending",
    recipient: "E-commerce Store",
  },
]

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "user", isActive: true, walletBalance: 1250.75 },
  { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "user", isActive: true, walletBalance: 890.25 },
  { id: "3", name: "Bob Smith", email: "bob@example.com", role: "user", isActive: false, walletBalance: 2100.5 },
  { id: "4", name: "Carol White", email: "carol@example.com", role: "admin", isActive: true },
  { id: "5", name: "David Brown", email: "david@example.com", role: "user", isActive: true, walletBalance: 450.0 },
]

// Mock API functions
export const mockApi = {
  // User transactions
  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockTransactions
  },

  // Submit transaction
  submitTransaction: async (transaction: Omit<Transaction, "id" | "date" | "status">): Promise<Transaction> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "pending",
    }
    mockTransactions.unshift(newTransaction)
    return newTransaction
  },

  // Get all users (Admin)
  getAllUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockUsers
  },

  // Toggle user status
  toggleUserStatus: async (userId: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.isActive = !user.isActive
    }
    return user!
  },

  // Get payment summary
  getPaymentSummary: async (): Promise<PaymentSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockUsers
      .filter((u) => u.role === "user")
      .map((user) => ({
        userId: user.id,
        userName: user.name,
        totalSent: Math.random() * 5000,
        totalReceived: Math.random() * 3000,
        transactionCount: Math.floor(Math.random() * 50) + 1,
      }))
  },

  // Add admin (Super Admin)
  addAdmin: async (adminData: { name: string; email: string }): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newAdmin: User = {
      id: Date.now().toString(),
      name: adminData.name,
      email: adminData.email,
      role: "admin",
      isActive: true,
    }
    mockUsers.push(newAdmin)
    return newAdmin
  },

  // Remove admin
  removeAdmin: async (adminId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockUsers.findIndex((u) => u.id === adminId && u.role === "admin")
    if (index > -1) {
      mockUsers.splice(index, 1)
      return true
    }
    return false
  },

  // Get system stats
  getSystemStats: async (): Promise<SystemStats> => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return {
      totalPayments: 15847,
      activeUsers: mockUsers.filter((u) => u.isActive && u.role === "user").length,
      totalVolume: 2847593.45,
      pendingTransactions: 23,
    }
  },
}
