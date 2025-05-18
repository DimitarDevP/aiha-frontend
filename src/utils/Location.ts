export const getUserLocation = async (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to random location near San Francisco
          resolve(getFallbackLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Fallback if geolocation not supported
      resolve(getFallbackLocation());
    }
  });
};

const getFallbackLocation = (): { lat: number; lng: number } => {
  // Random location near San Francisco with slight variation
  return {
    lat: 37.7749 + (Math.random() - 0.5) * 0.1,
    lng: -122.4194 + (Math.random() - 0.5) * 0.1
  };
};