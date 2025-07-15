import { AdminLayout } from "@/components/layout/AdminLayout";
import { VendorRequestsTable } from "@/components/admin/vendor/VendorRequest";

function VendorRequestsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Requests</h1>
          <p className="text-muted-foreground">Manage pending vendor registration requests.</p>
        </div>

        <VendorRequestsTable />
      </div>
    </AdminLayout>
  )
}

export default VendorRequestsPage;