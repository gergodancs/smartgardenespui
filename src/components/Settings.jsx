import React, {useEffect, useState} from "react";

const SettingsPage = ({onClose}) => {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const res = await fetch('/api/current-time');
                if (!res.ok) return;
                const data = await res.json();
                setCurrentDate(data.date);
                setCurrentTime(data.time);
            } catch (err) {
                console.warn("Nem sikerült lekérni az időt:", err);
            }
        };
        void fetchTime();
    }, []);

    const handleSave = async () => {
        try {
            const body = JSON.stringify({country, city});
            const res = await fetch('/api/system-config', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body
            });
            if (!res.ok) throw new Error();
            alert("✅ Beállítások mentve!");
            onClose();
        } catch {
            alert("⚠️ Mentés sikertelen.");
        }
    };

    const handleRestart = async () => {
        if (window.confirm("Biztosan újraindítod az ESP-t?")) {
            await fetch('/api/restart', {method: 'POST'});
        }
    };

    const handleFactoryReset = async () => {
        if (window.confirm("⚠️ Biztosan visszaállítod a gyári állapotot? Minden elveszik!")) {
            await fetch('/api/factory-reset', {method: 'POST'});
        }
    };

    return (
        <div className="settings-overlay">
            <div className="cycle-form" style={{marginTop:'0', backgroundColor:"#e2dddd"}}>

                <div className="form-group" style={{marginBottom: '5px'}}>
                    <div className="form-group">
                        <label>Date</label>
                        <div className="readonly-field">{currentDate || 'Unset!'}</div>
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <div className="readonly-field">{currentTime || 'Unset!'}</div>
                    </div>

                </div>

                <div className="form-group">
                    <div className="input-block">
                        <label htmlFor="country">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="pl. AT"
                        />
                    </div>
                    <div className="input-block">
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="pl. Wien"
                        />
                    </div>
                </div>

                <div className="control-panel">
                    <div style={{display: "flex", gap: "2px"}}>
                        <button style={{width: '100%'}} onClick={handleRestart}>Restart</button>
                        <button
                            onClick={handleFactoryReset}
                            style={{backgroundColor: 'crimson', color: 'white', width: "100%"}}
                        >Factory reset
                        </button>
                    </div>
                    <div style={{display: "flex", gap: "2px"}}>
                        <button style={{width: '100%'}} onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
