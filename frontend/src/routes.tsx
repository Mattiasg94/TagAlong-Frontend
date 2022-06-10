import React from "react";
import { Navigate, Outlet, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";

// const ProtectedRoute = (props: RouteProps) => {
//   const auth = useSelector((state: RootState) => state.auth);

//   if (auth.account) {
//     if (props.path === "/login") {
//       return <Navigate to={"/"} />;
//     }
//     return <Route {...props} />;
//   } else if (!auth.account) {
//     return <Navigate to={"/login"} />;
//   } else {
//     return <div>Not found</div>;
//   }
// };
const ProtectedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth.account ? <Outlet /> : <Navigate to={"/login"} />;
}
export default ProtectedRoute;

export const url= "http://api.tagalong.me/"

