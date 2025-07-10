import React from 'react';

const WeatherForm = ({weather, setWeather}) => {
    return (
        <div className="cycle-form">
            <div className="form-group">
                <div style={{marginBottom: "8px"}}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: "2px",
                        flexWrap: 'wrap'
                    }}>
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>Adjust watering if at least a</p>
                        <input
                            style={{maxWidth: "30px", padding: "2px", margin: '0 2px'}}
                            type="number"
                            value={weather.rainChanceThreshold}
                            onChange={(e) =>
                                setWeather({...weather, rainChanceThreshold: e.target.value})
                            }
                        />
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>% chance </p>
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>of rain is expected
                            within</p>
                        <input
                            style={{maxWidth: "30px", padding: "2px", margin: '0 2px'}}
                            type="number"
                            value={weather.forecastDays}
                            onChange={(e) =>
                                setWeather({...weather, forecastDays: e.target.value})
                            }
                        />
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>days.</p>
                    </div>
                </div>
            </div>

            {/* Critical soil moisture threshold */}
            <div className="form-group">
                <div style={{marginBottom: "8px"}}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: "2px",
                        flexWrap: 'wrap'
                    }}>
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>
                            If current soil moisture is below:
                        </p>
                        <input
                            style={{maxWidth: "30px", padding: "2px", margin: '0 2px'}}
                            type="number"
                            value={weather.criticalMoisture}
                            onChange={(e) =>
                                setWeather({...weather, criticalMoisture: e.target.value})
                            }
                        />
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>%</p>
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>water up to this level:</p>
                        <input
                            style={{width: "30px", padding: "2px"}}
                            type="number"
                            value={weather.preRainFill}
                            onChange={(e) =>
                                setWeather({...weather, preRainFill: e.target.value})
                            }
                        />
                        <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>%</p>
                    </div>
                </div>
            </div>

            {/* Enable checkbox */}
            <div className="form-group">
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        style={{width: '20px'}}
                        type="checkbox"
                        checked={weather.enabled}
                        onChange={(e) =>
                            setWeather({...weather, enabled: e.target.checked})
                        }
                    />
                    <p style={{fontSize: '12px', margin: '0', color: '#666666'}}>
                        Enable weather logic for this zone
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WeatherForm;
