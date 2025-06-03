import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { UserLayout } from "@/components/layout/UserLayout";
import { TRole } from "@/types/interfaces/User";

const ForgotPassPage = ({ userType }: { userType: TRole }) => {
  console.log(`usertype =>  ${userType}`);
  return <ForgotPassword userType={userType} />;
};

export default ForgotPassPage;
