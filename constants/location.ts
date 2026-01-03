// asks user for permission to recieve location, then determines users current city location and timezone

// still needs fallback behavior implementation

import  { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// gets user coordinates
export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [timeZone, setTimeZone] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                setErrorMsg("Permission denied");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // gets city from coordinates
            const [address] = await Location.reverseGeocodeAsync(currentLocation.coords);
            setCity(address.city);

            // gets tz from coordinates
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setTimeZone(tz);

            } catch (e: any) {
            setErrorMsg(e.message);
            }
        };
        fetchLocation();
    }, []);

    return { location, city, timeZone, errorMsg };
}
