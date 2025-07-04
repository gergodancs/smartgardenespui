import React from 'react';

const IntelligentForm = ({intelligent, setIntelligent}) => {
    return (
        <div className="cycle-form">
            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="dryRangeMin">Dry range min (%)</label>
                    <input id="dryRangeMin" type="number" value={intelligent.dryRangeMin}
                           onChange={(e) => setIntelligent({...intelligent, dryRangeMin: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="dryRangeMax">Dry range max (%)</label>
                    <input id="dryRangeMax" type="number" value={intelligent.dryRangeMax}
                           onChange={(e) => setIntelligent({...intelligent, dryRangeMax: e.target.value})}/>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="requiredDryHours">Required dry hours</label>
                    <input id="requiredDryHours" type="number" value={intelligent.requiredDryHours}
                           onChange={(e) => setIntelligent({...intelligent, requiredDryHours: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="dryCycleDays">Dry cycle (min. days)</label>
                    <input id="dryCycleDays" type="number" value={intelligent.dryCycleDays}
                           onChange={(e) => setIntelligent({...intelligent, dryCycleDays: e.target.value})}/>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="maxMoisture">Max moisture %</label>
                    <input id="maxMoisture" type="number" value={intelligent.maxMoisture}
                           onChange={(e) => setIntelligent({...intelligent, maxMoisture: e.target.value})}/>
                </div>
                <div style={{
                    width: '48%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.4rem'
                }}>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor={`startHour`}>Allowed from (hour)</label>
                    <select
                        id={`startHour`}
                        value={intelligent.startHour || ''}
                        onChange={(e) => setIntelligent(...intelligent, 'startHour', e.target.value)}
                    >
                        <option value="">Any time</option>
                        {[...Array(24)].map((_, i) => (
                            <option key={i} value={i}>{i}:00</option>
                        ))}
                    </select>
                </div>
                <div className="input-block">
                    <label htmlFor={`endHour`}>Until (hour)</label>
                    <select
                        id={`endHour`}
                        value={intelligent.endHour || ''}
                        onChange={(e) => setIntelligent(...intelligent, 'endHour', e.target.value)}
                    >
                        <option value="">Any time</option>
                        {[...Array(24)].map((_, i) => (
                            <option key={i} value={i}>{i}:00</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default IntelligentForm;
