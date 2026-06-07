"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BarChart3Icon, Users, LogOut, Search, PenIcon, UserIcon, CalendarIcon, Settings, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEntries: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Get current user
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }

    // Get all users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(allUsers)
    setFilteredUsers(allUsers)

    // Calculate stats
    const totalEntries = allUsers.reduce((acc: number, user: any) => {
      const userEntries = JSON.parse(localStorage.getItem(`journal_entries_${user.id}`) || "[]")
      return acc + userEntries.length
    }, 0)

    // Consider active users those who have at least one entry
    const activeUsers = allUsers.filter((user: any) => {
      const userEntries = JSON.parse(localStorage.getItem(`journal_entries_${user.id}`) || "[]")
      return userEntries.length > 0
    }).length

    setStats({
      totalUsers: allUsers.length,
      totalEntries,
      activeUsers,
    })
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const handleDeleteUser = (userId: string) => {
    // Remove user from users array
    const updatedUsers = users.filter((u) => u.id !== userId)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Remove user's entries and mood data
    localStorage.removeItem(`journal_entries_${userId}`)
    localStorage.removeItem(`mood_data_${userId}`)

    // Update state
    setUsers(updatedUsers)
    setFilteredUsers(
      updatedUsers.filter((user) => {
        if (searchQuery.trim() === "") return true
        const query = searchQuery.toLowerCase()
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      }),
    )

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalUsers: prev.totalUsers - 1,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r border-gray-800 bg-gray-950">
          <div className="flex h-14 items-center border-b border-gray-800 px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <PenIcon className="h-6 w-6 text-teal-500" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-gray-50 transition-all"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-gray-50"
              >
                <BarChart3Icon className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
              </div>
              <Link href="/logout">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Mobile header */}
          <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950 md:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <PenIcon className="h-6 w-6 text-teal-500" />
                <span>Admin Panel</span>
              </Link>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Link href="/logout">
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <ModeToggle />
                <Link href="/dashboard">
                  <Button variant="outline" className="rounded-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card className="rounded-xl shadow-sm border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-500">Registered accounts</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEntries}</div>
                  <p className="text-xs text-gray-500">Journal entries created</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-gray-500">Users with journal entries</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
              <TabsList className="grid grid-cols-2 md:w-[400px] rounded-lg">
                <TabsTrigger value="users" className="rounded-lg">
                  Users
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg">
                  Recent Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card className="rounded-xl shadow-sm border-gray-800">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search users by name or email..."
                        className="w-full pl-8 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="rounded-md border border-gray-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-900/50">
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-gray-900/50">
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      user.role === "superadmin"
                                        ? "bg-purple-900/30 text-purple-300"
                                        : "bg-gray-800 text-gray-300"
                                    }`}
                                  >
                                    {user.role || "user"}
                                  </span>
                                </TableCell>
                                <TableCell>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</TableCell>
                                <TableCell className="text-right">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-900/20"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-xl border-gray-800">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the user account and all associated data. This
                                          action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="bg-red-500 hover:bg-red-600 rounded-lg"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                No users found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="rounded-xl shadow-sm border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest user actions and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample activity items */}
                      <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                        <div className="rounded-full bg-gray-800 p-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-gray-500">A new user account was created</p>
                          <p className="text-xs text-gray-500 mt-1">Today, 10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                        <div className="rounded-full bg-gray-800 p-2">
                          <PenIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Journal entry created</p>
                          <p className="text-xs text-gray-500">A user created a new journal entry</p>
                          <p className="text-xs text-gray-500 mt-1">Today, 9:15 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                        <div className="rounded-full bg-gray-800 p-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mood tracking</p>
                          <p className="text-xs text-gray-500">A user logged their mood</p>
                          <p className="text-xs text-gray-500 mt-1">Yesterday, 4:45 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
