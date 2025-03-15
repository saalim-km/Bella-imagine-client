import { getVendorDetails, updateVendorDetails } from "@/services/vendor/vendorService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useVendorDetailsQuery = (enabled = true) => {
  console.log("Vendor query called");
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: getVendorDetails,
    enabled,
  });
};


export const useUpdateVendorMutation = ()=> {
    return useMutation({
        mutationFn : updateVendorDetails,
    })
}