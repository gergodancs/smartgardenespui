import React, {useEffect, useState} from "react";

const Calibration = ({zone}) => {

    const [calibration, setCalibration] = useState({dryValue: null, wetValue: null});

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

    const handleCalibration = async (type) => {
        try {
            const res = await fetch(`/api/set-calibration?zone=${zone}&type=${type}`, {method: 'POST'});
            if (!res.ok) console.error(res);

            const result = await res.json();
            alert(`✅ ${type === 'dry' ? 'Száraz' : 'Nedves'} érték elmentve: ${result.value}`);
        } catch {
            alert('⚠️ Hiba a kalibrálás közben.');
        }
    };

    return (
        <>
            <div className="water-now mb0">
                <button onClick={() => handleCalibration('dry')}>Dry value: {calibration.dryValue ?? 'Calibrate dry'}</button>
                <button onClick={() => handleCalibration('wet')}>Wet value: {calibration.wetValue ?? 'Calibrate wet'}</button>
            </div>
        </>
    )
}

export default Calibration;