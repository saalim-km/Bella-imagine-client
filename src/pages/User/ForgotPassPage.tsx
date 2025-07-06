import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { UserLayout } from "@/components/layout/UserLayout";
import { TRole } from "@/types/interfaces/User";

const ForgotPassPage = ({ userType }: { userType: TRole }) => {
  return (
    <UserLayout>
      <ForgotPassword userType={userType} />
    </UserLayout>
  );
};

export default ForgotPassPage;
