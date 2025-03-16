"use client"
import { useState } from "react"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useVendorRequests, useApproveVendorRequest, useRejectVendorRequest } from "@/hooks"

export function VendorRequestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const predefinedReasons = [
    "Incomplete profile information",
    "Unverified contact details",
    "Does not meet quality standards",
    "Other (Specify reason)"
  ]

  const { data: vendorRequestsData, isLoading } = useVendorRequests(
    { status: "Pending", search: searchTerm },
    { page: currentPage, limit: 10 }
  )

  const { mutate: approveVendor, isPending: isApproving } = useApproveVendorRequest()
  const { mutate: rejectVendor, isPending: isRejecting } = useRejectVendorRequest()

  const vendorRequests = vendorRequestsData?.data || []

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleApprove = (id: number) => {
    approveVendor(id)
  }

  const handleOpenRejectModal = (id: number) => {
    setSelectedVendor(id)
    setRejectModalOpen(true)
  }

  const handleReject = () => {
    if (selectedVendor) {
      rejectVendor({ id: selectedVendor, reason: rejectReason })
      setRejectModalOpen(false)
      setRejectReason("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Requests</CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="Search requests..." className="w-[250px]" value={searchTerm} onChange={handleSearch} />
            <Button variant="outline" size="sm" onClick={() => setIsFiltering(!isFiltering)}>
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Loading vendor requests...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.category}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{request.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(request.id)}
                        disabled={isApproving}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOpenRejectModal(request.id)}
                        disabled={isRejecting}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Select a reason for rejection:</p>
            <div className="space-y-2">
              {predefinedReasons.map((reason, index) => (
                <Button
                  key={index}
                  variant={rejectReason === reason ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setRejectReason(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
            {rejectReason === "Other (Specify reason)" && (
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
