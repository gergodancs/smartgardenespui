import './App.css';
import Zone from "./components/Zone";
import ZoneCycles from "./components/ZoneCycles";
import {useState} from "react";
import WifiStatus from "./components/WifiStatus";
import SettingsPage from "./components/Settings";
import WeatherBar from "./components/weather-bar/WeatherBar";

function App() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [zone, setZone] = useState(-1);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div className="App">
            <WifiStatus isFormVisible={isFormVisible}/>
            <h1 style={{margin: "0", color:"#666666"}}>Smart garden</h1>
            {!isFormVisible ?
                <>
                    <WeatherBar/>
                    <div className="settings-bar" onClick={() => setSettingsOpen((prev) => !prev)}>
                        ⚙️
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
