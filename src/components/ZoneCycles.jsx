import React, {useEffect, useState} from "react";
import CycleForm from "./CycleForm";

const ZoneCycles = ({zone, setVisible}) => {
    const [mode, setMode] = useState('moisture-cycles');
    const [cycles, setCycles] = useState([
        {minMoisture: '', maxMoisture: '', dryCycle: '', startMonth: '', startDay: ''}
    ]);

    const [intervalMax, setIntervalMax] = useState({intervalDays: ''});
    const [intervalDuration, setIntervalDuration] = useState({intervalDays: '', durationMinutes: ''});
    const [watering, setWatering] = useState(false);
    const [isWaterNowEnabled, setIsWaterNowEnabled] = useState(false);
    const [calibration, setCalibration] = useState({dryValue: null, wetValue: null});

    useEffect(() => {
        const loadZoneConfig = async () => {
            try {
                const res = await fetch(`/api/zone-config?zone=${zone}`);
                if (!res.ok) return;

                const data = await res.json();
                setMode(data.mode || 'moisture-cycles');

                if (data.mode === 'moisture-cycles' && Array.isArray(data.cycles)) {
                    const filledCycles = data.cycles.map(c => ({
                        minMoisture: String(c.minMoisture ?? ''),
                        maxMoisture: String(c.maxMoisture ?? ''),
                        dryCycle: String(c.dryCycle ?? ''),
                        startMonth: String(c.startMonth ?? ''),
                        startDay: String(c.startDay ?? '')
                    }));
                    setCycles([...filledCycles, ...new Array(4 - filledCycles.length).fill({
                        minMoisture: '', maxMoisture: '', dryCycle: '', startMonth: '', startDay: ''
                    })]);
                }

                if (data.mode === 'interval-max') {
                    setIntervalMax({
                        intervalDays: String(data.intervalDays ?? ''),
                        maxMoisture: String(data.maxMoisture ?? '')
                    });
                }

                if (data.mode === 'interval-duration') {
                    setIntervalDuration({
                        intervalDays: String(data.intervalDays ?? ''),
                        durationMinutes: String(data.durationMinutes ?? '')
                    });
                }

            } catch (err) {
                console.warn("Nem sikerült lekérni a mentett konfigurációt:", err);
            }
        };
        void loadZoneConfig();

    }, [zone]);

    useEffect(() => {
        let enabled = false;

        if (mode === 'moisture-cycles') {
            enabled = cycles.some(c => c.minMoisture !== '' && c.maxMoisture !== '');
        }

        if (mode === 'interval-max') {
            enabled = intervalMax.intervalDays !== '' && intervalMax.maxMoisture !== '';
        }

        if (mode === 'interval-duration') {
            enabled = intervalDuration.intervalDays !== '' && intervalDuration.durationMinutes !== '';
        }

        setIsWaterNowEnabled(enabled);
    }, [mode, cycles, intervalMax, intervalDuration]);


    const handleFormChange = (index, field, value) => {
        const updated = [...cycles];
        updated[index][field] = value;
        setCycles(updated);
        // Automatikus következő nap beállítása, ha az első ciklus startDate-je változott
        if (index < cycles.length - 1 && (field === 'startMonth' || field === 'startDay')) {
            const current = updated[index];
            const month = parseInt(current.startMonth);
            const day = parseInt(current.startDay);

            if (!isNaN(month) && !isNaN(day)) {
                const nextDate = new Date(2024, month - 1, day + 1); // automatikusan kezeli a hónapváltást is
                const nextCycle = updated[index + 1];

                if (nextCycle.startMonth === '' && nextCycle.startDay === '') {
                    nextCycle.startMonth = String(nextDate.getMonth() + 1);
                    nextCycle.startDay = String(nextDate.getDate());
                    setCycles([...updated]);
                }
            }
        }

    };

    const handleSubmit = async () => {
        let result = {zoneId: zone, mode: mode};

        if (mode === 'moisture-cycles') {
            result.cycles = cycles.filter(c =>
                c.minMoisture !== '' &&
                c.maxMoisture !== '' &&
                c.dryCycle !== '' &&
                c.startMonth !== '' &&
                c.startDay !== ''
            );
        } else if (mode === 'interval-max') {
            result.intervalDays = parseInt(intervalMax.intervalDays);
            result.maxMoisture = parseInt(intervalMax.maxMoisture);
        } else if (mode === 'interval-duration') {
            result.intervalDays = parseInt(intervalDuration.intervalDays);
            result.durationMinutes = parseInt(intervalDuration.durationMinutes);
        }

        try {
            const res = await fetch('/api/zone-config', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(result),
            });

            if (!res.ok) throw new Error();
            alert('Beállítás elmentve!');
        } catch {
            alert('Mentési hiba!');
        }
    };

    const handleManualWater = async () => {
        try {
            const endpoint = watering ? '/api/water-stop' : '/api/water-now';
            const res = await fetch(`${endpoint}?zone=${zone}`, {method: 'POST'});
            if (!res.ok) throw new Error();
            setWatering(!watering);
            alert(watering ? 'Locsolás leállítva!' : 'Azonnali locsolás elindítva!');
        } catch {
            alert('Hiba az locsolás vezérlésénél');
        }
    };

    const handleCalibration = async (type) => {
        try {
            const res = await fetch(`/api/set-calibration?zone=${zone}&type=${type}`, {method: 'POST'});
            if (!res.ok) throw new Error();

            const result = await res.json();
            alert(`✅ ${type === 'dry' ? 'Száraz' : 'Nedves'} érték elmentve: ${result.value}`);
        } catch {
            alert('⚠️ Hiba a kalibrálás közben.');
        }
    };

    useEffect(() => {
        const fetchCalibration = async () => {
            try {
                const res = await fetch(`/api/get-calibration?zone=${zone}`);
                if (!res.ok) return;
                const data = await res.json();
                setCalibration({
                    dryValue: data.dryValue ?? null,
                    wetValue: data.wetValue ?? null,
                });
            } catch (err) {
                console.warn("Nem sikerült lekérni a kalibrációs adatokat:", err);
            }
        };
        void fetchCalibration();
    }, [zone]);

    return (
        <div className="zone-cycles">

            <div className="control-panel">
                <div className="mode-tabs">
                    <button className={`tab-button ${mode === 'moisture-cycles' ? 'active' : ''}`}
                            onClick={() => setMode('moisture-cycles')}>Moisture cycles
                    </button>
                    <button className={`tab-button ${mode === 'interval-max' ? 'active' : ''}`}
                            onClick={() => setMode('interval-max')}>Interval (max)
                    </button>
                    <button className={`tab-button ${mode === 'interval-duration' ? 'active' : ''}`}
                            onClick={() => setMode('interval-duration')}>Interval (duration)
                    </button>
                </div>

                <div className="water-now">
                    <button disabled={!isWaterNowEnabled}
                            onClick={handleManualWater}>{watering ? 'Stop Watering' : 'Water Now'}</button>
                    <button onClick={() => handleCalibration('dry')}>Set Dry</button>
                    <button onClick={() => handleCalibration('wet')}>Set Wet</button>
                </div>
                <div className="calibration-values">
                    <div>🌵 Dry value: {calibration.dryValue ?? 'unset'}</div>
                    <div>💧 Wet value: {calibration.wetValue ?? 'unset'}</div>
                </div>

            </div>
            {mode === 'moisture-cycles' && (
                <>
                    {cycles.map((cycle, index) => (
                        <CycleForm key={index}
                                   index={index}
                                   formData={cycle}
                                   onChange={handleFormChange}
                                   onDelete={(i) => setCycles(cycles.filter((_, idx) => idx !== i))}/>
                    ))}
                    <button className="add-period" onClick={() =>
                        setCycles([...cycles, {
                            minMoisture: '',
                            maxMoisture: '',
                            dryCycle: '',
                            startMonth: '',
                            startDay: ''
                        }])
                    }>
                        ➕ Add Period
                    </button>
                </>
            )}


            {mode === 'interval-max' && (
                <div className="cycle-form">
                    <div className="form-group">
                        <input
                            type="number"
                            placeholder="Interval in days"
                            value={intervalMax.intervalDays}
                            onChange={(e) => setIntervalMax({intervalDays: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Max moisture %"
                            value={intervalMax.maxMoisture}
                            onChange={(e) => setIntervalMax({...intervalMax, maxMoisture: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {mode === 'interval-duration' && (
                <div className="cycle-form">
                    <div className="form-group">
                        <input
                            placeholder="Watering cyle interval in days"
                            type="number"
                            value={intervalDuration.intervalDays}
                            onChange={(e) => setIntervalDuration({...intervalDuration, intervalDays: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Watering duration (minutes)"
                            value={intervalDuration.durationMinutes}
                            onChange={(e) => setIntervalDuration({
                                ...intervalDuration,
                                durationMinutes: e.target.value
                            })}
                        />
                    </div>
                </div>
            )}

            <div className="buttons">
                <button onClick={handleSubmit}>Submit All</button>
                <button onClick={() => setVisible(false)}>Back</button>
            </div>
        </div>
    );
};

export default ZoneCycles;
