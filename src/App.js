import './App.css';
import Zone from "./components/Zone";
import ZoneCycles from "./components/ZoneCycles";
import {useState} from "react";
import WifiSetup from "./components/WifiSetup";
import WifiStatus from "./components/WifiStatus";
import SettingsPage from "./components/Settings";

function App() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [zone, setZone] = useState(-1);
    const [wifiVisible, setWifiVisible] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);


    return (
        <div className="App">
            <WifiStatus/>

            <h1 style={{marginTop: "0"}}>Smart garden</h1>
            {wifiVisible && <WifiSetup onClose={() => setWifiVisible(false)}/>}
            {!isFormVisible
                ? <>
                    <button onClick={() => setWifiVisible(true)} className="wifi-button">
                        🌐 WiFi connect
                    </button>
                    <div className="settings-bar" onClick={() => setSettingsOpen((prev) => !prev)}>
                        ⚙️ Settings
                    </div>
                    {settingsOpen && <SettingsPage onClose={() => setSettingsOpen(false)}/>}
                    <Zone setVisible={setIsFormVisible} setZone={setZone}/>
                </>
                : <ZoneCycles zone={zone} setVisible={setIsFormVisible} setZone={setZone}/>
            }
        </div>
    );
}

export default App;
