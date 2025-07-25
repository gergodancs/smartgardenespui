import { useEffect } from "react";

export default function useZoneConfig(zone, setMode, setIntelligent, setCycles, setIntervalMaxCycles, setIntervalDurationCycles,setWeather) {
    useEffect(() => {
        const loadZoneConfig = async () => {
            if (!zone) return;
            try {
                const res = await fetch(`/api/zone-config?zone=${zone}`);
                if (!res.ok) return;

                const data = await res.json();
                setMode(data.mode || 'intelligent-dry-cycle');

                if (data.mode === 'moisture-cycles' && Array.isArray(data.cycles)) {
                    const filledCycles = data.cycles.map(c => ({
                        minMoisture: String(c.minMoisture ?? ''),
                        maxMoisture: String(c.maxMoisture ?? ''),
                        dryCycle: String(c.dryCycle ?? ''),
                        startMonth: String(c.startMonth ?? ''),
                        startDay: String(c.startDay ?? ''),
                        startHour: String(c.startHour ?? ''),
                        endHour: String(c.endHour ?? '')
                    }));
                    setCycles(filledCycles.length > 0 ? filledCycles : [{
                        minMoisture: '', maxMoisture: '', dryCycle: '', startMonth: '', startDay: '', startHour: '', endHour: ''
                    }]);

                }

                if (data.mode === 'intelligent-dry-cycle') {
                    setIntelligent({
                        dryRangeMin: String(data.dryRangeMin ?? ''),
                        dryRangeMax: String(data.dryRangeMax ?? ''),
                        requiredDryHours: String(data.requiredDryHours ?? ''),
                        dryCycleDays: String(data.dryCycleDays ?? ''),
                        maxMoisture: String(data.maxMoisture ?? ''),
                        wetHoldHours:String(data.wetHoldHours ?? ''),
                        wetMin:String(data.wetMin ?? ''),
                        wetMax:String(data.wetMax ?? ''),
                        startHour: String(data.startHour ?? ''),
                        endHour: String(data.endHour ?? '')
                    });
                }

                if (data.mode === 'interval-max' && Array.isArray(data.cycles)) {
                    setIntervalMaxCycles(data.cycles.map(c => ({
                        intervalDays: String(c.intervalDays ?? ''),
                        maxMoisture: String(c.maxMoisture ?? ''),
                        startMonth: String(c.startMonth ?? ''),
                        startDay: String(c.startDay ?? ''),
                        startHour: String(c.startHour ?? ''),
                        endHour: String(c.endHour ?? '')
                    })));
                }

                if (data.mode === 'interval-duration' && Array.isArray(data.cycles)) {
                    setIntervalDurationCycles(data.cycles.map(c => ({
                        intervalDays: String(c.intervalDays ?? ''),
                        durationMinutes: String(c.durationMinutes ?? ''),
                        startMonth: String(c.startMonth ?? ''),
                        startDay: String(c.startDay ?? ''),
                        startHour: String(c.startHour ?? ''),
                        endHour: String(c.endHour ?? '')
                    })));
                }
                if (data.weather && setWeather) {
                    setWeather({
                        enabled: Boolean(data.weather.enabled ?? false),
                        rainChanceThreshold: String(data.weather.rainChanceThreshold ?? ''),
                        forecastDays: String(data.weather.forecastDays ?? ''),
                        criticalMoisture: String(data.weather.criticalMoisture ?? ''),
                        preRainFill: String(data.weather.preRainFill ?? '')
                    });
                }

            } catch (err) {
                console.warn("Nem sikerült lekérni a mentett konfigurációt:", err);
            }
        };

       void loadZoneConfig();
    }, [zone, setMode, setIntelligent, setCycles, setIntervalMaxCycles, setIntervalDurationCycles, setWeather]);
}
