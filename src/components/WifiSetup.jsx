import React, {useEffect, useState} from "react";

const WifiSetup = ({onClose}) => {
    const [networks, setNetworks] = useState([]);
    const [selectedSsid, setSelectedSsid] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch('/api/wifi-scan')
            .then(res => {
                console.log('Raw response:', res);
                return res.json();
            })
            .then(data => {
                console.log('Parsed JSON:', data);
                setNetworks(data);
            })
            .catch(err => console.warn('Hálózat lista lekérés hiba:', err));
    }, []);


    const handleConnect = async () => {
        try {
            const res = await fetch('/api/wifi-connect', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ssid: selectedSsid, password})
            });

            const result = await res.json();
            if (res.ok) {
                setStatus(`✅ Mentve. Újraindítás folyamatban...`);
            } else {
                setStatus(`❌ Hiba: ${result.error || 'ismeretlen'}`);
            }
        } catch (e) {
            setStatus('❌ Hálózati hiba.');
        }
    };

    return (
        <div className="cycle-form">
            <h3 style={{marginBottom: "5px", marginTop:'0'}}>Válassz hálózatot</h3>
            <div className="input-block mr-2">
                <select value={selectedSsid} onChange={e => setSelectedSsid(e.target.value)}>
                    <option value="">-- Válassz --</option>
                    {networks.map((ssid, i) => (
                        <option key={i} value={ssid}>{ssid}</option>
                    ))}
                </select>
            </div>
            <div className="input-block">
                <input
                    type="password"
                    placeholder="WiFi jelszó"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <div className="wifi-button">
                <button onClick={handleConnect}>Csatlakozás</button>
                <button onClick={onClose}>Vissza</button>
            </div>
            {
                status && <p>{status}</p>
            }
        </div>
    )
        ;
};

export default WifiSetup;
