import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { LoadingBar } from "@/components/ui/LoadBar";
import { useVendorDetailsQuery } from "@/hooks/admin/useVendor";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";

const UserDetailsPage = () => {
  const { id, role } = useParams();
  const ProfileInfo = lazy(() => import("@/components/User/ProfileInfo"));
  const { data, isLoading } = useVendorDetailsQuery(
    id!,
    role as "vendor" | "client"
  );
  const navigate = useNavigate();
  if (isLoading) {
    return <LoadingBar />;
  }
  return (
    <AdminLayout>
      <div>
        <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {data?.data && (
          <Suspense fallback={<LoadingBar />}>
            <ProfileInfo data={data.data} />{" "}
          </Suspense>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserDetailsPage;
