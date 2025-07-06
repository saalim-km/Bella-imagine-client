export const TRAVEL_RATE_PER_KM = 25
export const FREE_RADIUS_KM = 10

export interface DistanceResult {
  distance: number
  travelTime: string
  travelFee: number
}

declare global {
  interface Window {
    google: any
  }
}

export const calculateTravelFee = (distanceInKm: number): number => {
  if (distanceInKm <= FREE_RADIUS_KM) {
    return 0
  }
  const excessDistance = distanceInKm - FREE_RADIUS_KM
  return Math.ceil(excessDistance) * TRAVEL_RATE_PER_KM
}

export const calculateDistanceAndTime = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<DistanceResult> => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error("Google Maps not loaded"))
      return
    }

    const service = new window.google.maps.DistanceMatrixService()

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response : any, status : any) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
          const result = response.rows[0].elements[0]

          if (result.status === window.google.maps.DistanceMatrixElementStatus.OK) {
            const distanceInKm = result.distance.value / 1000
            const travelTime = result.duration.text
            const travelFee = calculateTravelFee(distanceInKm)

            resolve({
              distance: distanceInKm,
              travelTime,
              travelFee,
            })
          } else {
            reject(new Error(`Distance calculation failed: ${result.status}`))
          }
        } else {
          reject(new Error(`Distance Matrix API error: ${status}`))
        }
      },
    )
  })
}
