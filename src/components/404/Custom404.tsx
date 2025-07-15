import Admin404  from "./Admin404";
import  Client404  from "./Client404";

export const Custom404 = ({ pathname }: { pathname: string }) => {
  if (pathname.startsWith("/admin")) {
    return <Admin404 />;
  }else {
    return <Client404 />;
  }
};