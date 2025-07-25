import React, {useEffect, useState} from "react";
import MoistureBasedForm from "./moisture-based-form/MoistureBasedForm";
import GenericCycleList from "./common-intervall-form/GenericCycleList";
import IntelligentForm from "./intelligent-watering-form/IntelligentForm";
import ModeTabs from "./mode-tabs/ModeTabs";
import Calibration from "./sensor-calibration/Calibration";
import useZoneConfig from "../hooks/useZoneConfig";
import useSubmitZoneConfig from "../hooks/useSubmitZoneConfig";
import WeatherForm from "./weather-form/WeatherForm";

const ZoneCycles = ({zone, setVisible, setZone}) => {
    const [mode, setMode] = useState('intelligent-dry-cycle');

    const [intelligent, setIntelligent] = useState({
        dryRangeMin: '',
        dryRangeMax: '',
        wetMin: '',
        wetMax: '',
        wetHoldHours: '',
        requiredDryHours: '',
        dryCycleDays: '',
        maxMoisture: '',
        startHour: '',
        endHour: ''
    });

    const [cycles, setCycles] = useState([
        {minMoisture: '', maxMoisture: '', dryCycle: '', startMonth: '', startDay: '', startHour: '', endHour: ''}
    ]);

    const [intervalMaxCycles, setIntervalMaxCycles] = useState([
        {intervalDays: '', maxMoisture: '', startMonth: '', startDay: '', startHour: '', endHour: ''}
    ]);

    const [intervalDurationCycles, setIntervalDurationCycles] = useState([
        {intervalDays: '', durationMinutes: '', startMonth: '', startDay: '', startHour: '', endHour: ''}
    ]);

    const [weather, setWeather] = useState({
        enabled: false,
        rainChanceThreshold: '',  // % esély fölött számít várhatónak az eső
        forecastDays: '',         // ennyi napon belül vizsgálja az esőt
        criticalMoisture: '',     // ha ez alatt van, akkor ne várjon esőre
        preRainFill: '',          // ha túl száraz, de eső várható, idáig töltse fel
    });


    const [watering, setWatering] = useState(false);

    const submitZoneConfig = useSubmitZoneConfig();
    useZoneConfig(zone, setMode, setIntelligent, setCycles, setIntervalMaxCycles, setIntervalDurationCycles, setWeather);

    useEffect(() => {
        const fetchActiveZones = async () => {
            try {
                const res = await fetch('/api/active-zones');
                if (!res.ok) return;
                const activeZoneIds = await res.json();
                setWatering(activeZoneIds.includes(zone));
            } catch (err) {
                console.warn("Nem sikerült lekérni az aktív zónákat:", err);
            }
        };
        void fetchActiveZones();
    }, [zone]);


    const handleFormChange = (index, field, value) => {
        const updated = [...cycles];
        updated[index][field] = value;
        setCycles(updated);
        console.log(updated);
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

    const handleSubmit = () => {
        void submitZoneConfig({
            zoneId: zone,
            mode,
            cycles:
                mode === 'moisture-cycles' ? cycles :
                    mode === 'interval-max' ? intervalMaxCycles :
                        mode === 'interval-duration' ? intervalDurationCycles : [],
            intelligent,
            weather: weather.enabled ? weather : {enabled: false}
        })
    };

    const handleManualWater = async () => {
        try {
            const endpoint = watering ? '/api/water-stop' : '/api/water-now';
            const res = await fetch(`${endpoint}?zone=${zone}`, {method: 'POST'});
            if (!res.ok) console.error(res);
            setWatering(!watering);
            alert(watering ? 'Locsolás leállítva!' : 'Azonnali locsolás elindítva!');
        } catch {
            alert('Hiba az locsolás vezérlésénél');
        }
    };


    const goToMainPage = () => {
        setVisible(false);
        setZone(-1);
    }

    return (
        <div className="zone-cycles">

            <div className="control-panel">
                <ModeTabs mode={mode} setMode={setMode}/>
                <Calibration zone={zone}/>
                <div>
                    <button style={{
                        width: '100%',
                        backgroundColor: "#66a0cf",
                        padding: "0.4rem 1rem",
                        border: "1px solid lightblue"
                    }}
                            onClick={handleManualWater}>
                        {watering ? 'Stop Watering' : 'Water Now'}
                    </button>
                </div>
            </div>

            {mode === 'moisture-cycles' && (
                <>
                    {cycles.map((cycle, index) => (
                        <MoistureBasedForm
                            key={index}
                            index={index}
                            formData={cycle}
                            onChange={handleFormChange}
                            onDelete={(i) => setCycles(cycles.filter((_, idx) => idx !== i))}
                        />
                    ))}
                    <button className="add-period" onClick={() =>
                        setCycles([...cycles, {
                            minMoisture: '',
                            maxMoisture: '',
                            dryCycle: '',
                            startMonth: '',
                            startDay: '',
                            startHour: '',
                            endHour: '',
                        }])
                    }>
                        Add Period
                    </button>
                </>
            )}

            {mode === 'intelligent-dry-cycle' && (
                <IntelligentForm intelligent={intelligent} setIntelligent={setIntelligent}/>
            )}

            {mode === 'interval-max' && (
                <GenericCycleList
                    cycles={intervalMaxCycles}
                    setCycles={setIntervalMaxCycles}
                    type="interval-max"
                />
            )}

            {mode === 'interval-duration' && (
                <GenericCycleList
                    cycles={intervalDurationCycles}
                    setCycles={setIntervalDurationCycles}
                    type="interval-duration"
                />
            )}

            {(mode === 'moisture-cycles' ||
                mode === 'interval-max' ||
                mode === 'interval-duration' ||
                mode === 'intelligent-dry-cycle') && (
                <WeatherForm weather={weather} setWeather={setWeather}/>
            )}

            <div className="buttons">
                <button onClick={handleSubmit}>Save</button>
                <button onClick={goToMainPage}>Back</button>
            </div>
        </div>
    );

};

export default ZoneCycles;
