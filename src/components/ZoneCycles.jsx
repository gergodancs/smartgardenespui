import React, {useEffect, useState} from "react";
import CycleForm from "./CycleForm";

const ZoneCycles = ({zone, setVisible, setZone}) => {
    const [mode, setMode] = useState('intelligent-dry-cycle');
    const [cycles, setCycles] = useState([
        {minMoisture: '', maxMoisture: '', dryCycle: '', startMonth: '', startDay: ''}
    ]);
    const [intelligent, setIntelligent] = useState({
        dryRangeMin: '', dryRangeMax: '', requiredDryHours: '',
        dryCycleDays: '', maxMoisture: '', skipIfRainExpected: true
    });

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
                setMode(data.mode || 'intelligent-dry-cycle');

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

                if (data.mode === 'intelligent-dry-cycle') {
                    setIntelligent({
                        dryRangeMin: String(data.dryRangeMin ?? ''),
                        dryRangeMax: String(data.dryRangeMax ?? ''),
                        requiredDryHours: String(data.requiredDryHours ?? ''),
                        dryCycleDays: String(data.dryCycleDays ?? ''),
                        maxMoisture: String(data.maxMoisture ?? ''),
                        skipIfRainExpected: Boolean(data.skipIfRainExpected ?? true),
                    });
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
        } else if (mode === 'intelligent-dry-cycle') {
            result = {
                zoneId: zone,
                mode,
                ...intelligent,
                dryRangeMin: parseInt(intelligent.dryRangeMin),
                dryRangeMax: parseInt(intelligent.dryRangeMax),
                requiredDryHours: parseInt(intelligent.requiredDryHours),
                dryCycleDays: parseInt(intelligent.dryCycleDays),
                maxMoisture: parseInt(intelligent.maxMoisture),
                skipIfRainExpected: Boolean(intelligent.skipIfRainExpected)
            };
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

    const goToMainPage = () => {
        setVisible(false);
        setZone(-1);
    }

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
                    <div style={{display: "flex", gap: "2px"}}>
                        <button style={{width: '100%'}}
                                className={`tab-button ${mode === 'intelligent-dry-cycle' ? 'active' : ''}`}
                                onClick={() => setMode('intelligent-dry-cycle')}>
                            Smart dry tracking
                        </button>
                        <button style={{width: '100%'}}
                                className={`tab-button ${mode === 'moisture-cycles' ? 'active' : ''}`}
                                onClick={() => setMode('moisture-cycles')}>
                            Moisture cycles
                        </button>
                    </div>
                    <div style={{display: "flex", gap: "2px"}}>
                        <button style={{width: '100%'}}
                                className={`tab-button ${mode === 'interval-max' ? 'active' : ''}`}
                                onClick={() => setMode('interval-max')}>Interval (max)
                        </button>
                        <button style={{width: '100%'}}
                                className={`tab-button ${mode === 'interval-duration' ? 'active' : ''}`}
                                onClick={() => setMode('interval-duration')}>Interval (duration)
                        </button>
                    </div>
                </div>

                <div className="water-now mb0">
                    <button onClick={() => handleCalibration('dry')}>Calibrate dry</button>
                    <button onClick={() => handleCalibration('wet')}>Calibrate wet</button>
                </div>
                <div className="calibration-values">
                    <div style={{fontSize: "13px"}}>Dry value: {calibration.dryValue ?? 'unset'}</div>
                    <div style={{fontSize: "13px"}}>Wet value: {calibration.wetValue ?? 'unset'}</div>
                </div>
                <div>
                    <button style={{width: '100%', backgroundColor: "#66a0cf"}} disabled={!isWaterNowEnabled}
                            onClick={handleManualWater}>{watering ? 'Stop Watering' : 'Water Now'}</button>
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
                        Add Period
                    </button>
                </>
            )}

            {mode === 'intelligent-dry-cycle' && (
                <div className="cycle-form">
                    <div className="form-group">
                        <input type="number" placeholder="Dry range min %" value={intelligent.dryRangeMin}
                               onChange={(e) => setIntelligent({...intelligent, dryRangeMin: e.target.value})}/>
                        <input type="number" placeholder="Dry range max %" value={intelligent.dryRangeMax}
                               onChange={(e) => setIntelligent({...intelligent, dryRangeMax: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="Required dry hours" value={intelligent.requiredDryHours}
                               onChange={(e) => setIntelligent({...intelligent, requiredDryHours: e.target.value})}/>
                        <input type="number" placeholder="Dry cycle (min. days)" value={intelligent.dryCycleDays}
                               onChange={(e) => setIntelligent({...intelligent, dryCycleDays: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="Max moisture %"
                               value={intelligent.maxMoisture}
                               onChange={(e) => setIntelligent({...intelligent, maxMoisture: e.target.value})}/>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0,4rem'
                        }}>
                            <div style={{whiteSpace: 'nowrap', padding: "0.4rem", marginBottom: "0.75rem", color:"#6b6a6a"}}>Rain check
                            </div>
                            <input type="checkbox"
                                   checked={intelligent.skipIfRainExpected}
                                   onChange={(e) => setIntelligent({
                                       ...intelligent,
                                       skipIfRainExpected: e.target.checked
                                   })}/>
                        </div>

                    </div>
                </div>
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
                <button onClick={goToMainPage}>Back</button>
            </div>
        </div>
    );
};

export default ZoneCycles;
