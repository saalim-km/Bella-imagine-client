import { getVendorDetails } from "@/services/vendor/vendorService"
import { useQuery } from "@tanstack/react-query"

export const useVendorQuery = (enabled = true) => {
    console.log('Vendor query called');
    return useQuery({
        queryKey: ["vendor-profile"],
        queryFn: getVendorDetails,
        enabled,
    });
};