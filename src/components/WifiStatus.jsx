// components/WifiStatus.js
import React, {useEffect, useState} from "react";
import WifiSetup from "./WifiSetup";

const WifiStatus = ({isFormVisible}) => {
    const [wifi, setWifi] = useState({
        connected: false,
        ip: '',
        ssid: '',
        rssi: ''
    });
    const [wifiVisible, setWifiVisible] = useState(false);
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/wifi-status');
                if (!res.ok) return;
                const data = await res.json();

                // Ha előzőleg nem volt csatlakozva és most igen → újratöltés
                if (!wifi.connected && data.connected) {
                    setWifi(data);
                } else {
                    setWifi(data);
                }
            } catch (err) {
                console.warn("Wi-Fi státusz hiba:", err);
            }
        };

        void fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="wifi-status" style={{margin: "0"}}>
            {!isFormVisible &&
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {wifi.connected ?
                        <div style={{width: '100%', textAlign: 'center', marginBottom: '3px'}}>Connected
                            to {wifi.ssid}</div>
                        : <div style={{width: '100%', textAlign: 'center', marginBottom: '3px'}}>Not connected</div>}
                </div>}

            {wifiVisible && <WifiSetup onClose={() => setWifiVisible(false)}/>}
            {!isFormVisible && !wifiVisible && !wifi.connected &&
                <div className="zone" style={{width: '200px'}} onClick={() => setWifiVisible(true)}>
                    WiFi connect
                </div>}
        </div>
    );
};

export default WifiStatus;
