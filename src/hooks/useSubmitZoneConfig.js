// hooks/useSubmitZoneConfig.js
const useSubmitZoneConfig = () => {
    const submitZoneConfig = async ({ zoneId, mode, cycles, intelligent }) => {
        let result = { zoneId, mode };

        if (mode === 'moisture-cycles') {
            result.cycles = cycles
                .filter(c =>
                    c.minMoisture !== '' &&
                    c.maxMoisture !== '' &&
                    c.dryCycle !== '' &&
                    c.startMonth !== '' &&
                    c.startDay !== ''
                )
                .map(c => ({
                    minMoisture: parseInt(c.minMoisture),
                    maxMoisture: parseInt(c.maxMoisture),
                    dryCycle: parseInt(c.dryCycle),
                    startMonth: parseInt(c.startMonth),
                    startDay: parseInt(c.startDay),
                    ...(c.startHour !== '' && { startHour: parseInt(c.startHour) }),
                    ...(c.endHour !== '' && { endHour: parseInt(c.endHour) })
                }));
        }

        else if (mode === 'interval-max') {
            result.cycles = cycles
                .filter(c =>
                    c.intervalDays !== '' &&
                    c.maxMoisture !== '' &&
                    c.startMonth !== '' &&
                    c.startDay !== ''
                )
                .map(c => ({
                    intervalDays: parseInt(c.intervalDays),
                    maxMoisture: parseInt(c.maxMoisture),
                    startMonth: parseInt(c.startMonth),
                    startDay: parseInt(c.startDay),
                    ...(c.startHour !== '' && { startHour: parseInt(c.startHour) }),
                    ...(c.endHour !== '' && { endHour: parseInt(c.endHour) })
                }));
        }

        else if (mode === 'interval-duration') {
            result.cycles = cycles
                .filter(c =>
                    c.intervalDays !== '' &&
                    c.durationMinutes !== '' &&
                    c.startMonth !== '' &&
                    c.startDay !== ''
                )
                .map(c => ({
                    intervalDays: parseInt(c.intervalDays),
                    durationMinutes: parseInt(c.durationMinutes),
                    startMonth: parseInt(c.startMonth),
                    startDay: parseInt(c.startDay),
                    ...(c.startHour !== '' && { startHour: parseInt(c.startHour) }),
                    ...(c.endHour !== '' && { endHour: parseInt(c.endHour) })
                }));
        }

        else if (mode === 'intelligent-dry-cycle') {
            result = {
                zoneId,
                mode,
                dryRangeMin: parseInt(intelligent.dryRangeMin),
                dryRangeMax: parseInt(intelligent.dryRangeMax),
                requiredDryHours: parseInt(intelligent.requiredDryHours),
                dryCycleDays: parseInt(intelligent.dryCycleDays),
                maxMoisture: parseInt(intelligent.maxMoisture),
                skipIfRainExpected: Boolean(intelligent.skipIfRainExpected),
                ...(intelligent.startHour !== '' && { startHour: parseInt(intelligent.startHour) }),
                ...(intelligent.endHour !== '' && { endHour: parseInt(intelligent.endHour) })
            };
        }

        try {
            const res = await fetch('/api/zone-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result),
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);
            alert('Beállítás elmentve!');
        } catch (err) {
            console.error('Mentési hiba:', err);
            alert('Mentési hiba!');
        }
    };

    return submitZoneConfig;
};

export default useSubmitZoneConfig;
