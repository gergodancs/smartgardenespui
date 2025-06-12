import './App.css';
import Zone from "./components/Zone";
import ZoneCycles from "./components/ZoneCycles";
import {useState} from "react";
import WifiSetup from "./components/WifiSetup";
import WifiStatus from "./components/WifiStatus";

function App() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [zone, setZone] = useState(-1);
    const [wifiVisible, setWifiVisible] = useState(false);


    return (
        <div className="App">
            <WifiStatus />
            {!isFormVisible && <div className="logo-container">
                <img className="smart-logo" src="/wifi2mini.png" alt="smartlogo"/>
            </div>}
            {wifiVisible && <WifiSetup onClose={() => setWifiVisible(false)} />}
            {!isFormVisible
                ? <>
                    <button onClick={() => setWifiVisible(true)} className="wifi-button">
                        🌐 WiFi connect
                    </button>
                    <Zone setVisible={setIsFormVisible} setZone={setZone}/>
                </>
                : <ZoneCycles zone={zone} setVisible={setIsFormVisible}/>
            }
        </div>
    );
}

export default App;
