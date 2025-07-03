// components/WifiStatus.js
import React, {useEffect, useState} from "react";

const WifiStatus = () => {
    const [wifi, setWifi] = useState({
        connected: false,
        ip: '',
        ssid: '',
        rssi: ''
    });
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/wifi-status');
                if (!res.ok) return;
                const data = await res.json();

                // Ha előzőleg nem volt csatlakozva és most igen → újratöltés
                if (!wifi.connected && data.connected) {
                    setWifi(data);
                    setTimeout(() => window.location.reload(), 2000); // kicsi késleltetés
                    return;
                }

                setWifi(data);
            } catch (err) {
                console.warn("Wi-Fi státusz hiba:", err);
            }
        };

        void fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="wifi-status">
            {wifi.connected ? (
                <div style={{display: "flex", justifyContent: "space-between"}}>
                   <div>✅ <strong>{wifi.ssid}</strong><br/></div>
                   <div>📶 {wifi.rssi} dBm<br/></div>
                    <div>🌐 {wifi.ip}</div>
                </div>
            ) : (
                <div>❌ Not connected</div>
            )}
        </div>
    );
};

export default WifiStatus;
