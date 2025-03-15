"use client"
import { useState } from "react"
// import { UserTable } from "@/components/admin/users/user-table"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import { ClientTable } from "@/components/admin/users/ClientTable"
import { UserTable } from "@/components/admin/users/VendorTable"

export default function UsersPage() {
  const [userType, setUserType] = useState("photographers")

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Vendors</h1>
          <p className="text-muted-foreground">Manage all users and vendors on the platform.</p>
        </div>

        <Tabs defaultValue="photographers" value={userType} onValueChange={setUserType} className="w-auto">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="photographers">Photographers (Vendors)</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="photographers" className="mt-4">
            <UserTable />
          </TabsContent>
          <TabsContent value="clients" className="mt-4">
            <ClientTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

