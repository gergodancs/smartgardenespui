import React from 'react';

const IntelligentForm = ({intelligent, setIntelligent}) => {
    return (
        <div className="cycle-form">

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="maxMoisture">Water up to % moisture</label>
                    <input id="maxMoisture" type="number" value={intelligent.maxMoisture}
                           onChange={(e) => setIntelligent({...intelligent, maxMoisture: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="wetHoldHours">Keep moisture x hours</label>
                    <input id="wetHoldHours" type="number" value={intelligent.wetHoldHours}
                           onChange={(e) => setIntelligent({...intelligent, wetHoldHours: e.target.value})}/>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="wetRangeMin">in the range of min %</label>
                    <input id="wetRangeMin" type="number" value={intelligent.wetMin}
                           onChange={(e) => setIntelligent({...intelligent, wetMin: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="wetRangeMax">max %</label>
                    <input id="wetRangeMax" type="number" value={intelligent.wetMax}
                           onChange={(e) => setIntelligent({...intelligent, wetMax: e.target.value})}/>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="dryCycleDays">Dry cycle (min. days)</label>
                    <input id="dryCycleDays" type="number" value={intelligent.dryCycleDays}
                           onChange={(e) => setIntelligent({...intelligent, dryCycleDays: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="requiredDryHours">Required dry hours</label>
                    <input id="requiredDryHours" type="number" value={intelligent.requiredDryHours}
                           onChange={(e) => setIntelligent({...intelligent, requiredDryHours: e.target.value})}/>
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor="dryRangeMin">in the range min %</label>
                    <input id="dryRangeMin" type="number" value={intelligent.dryRangeMin}
                           onChange={(e) => setIntelligent({...intelligent, dryRangeMin: e.target.value})}/>
                </div>
                <div className="input-block">
                    <label htmlFor="dryRangeMax">max %</label>
                    <input id="dryRangeMax" type="number" value={intelligent.dryRangeMax}
                           onChange={(e) => setIntelligent({...intelligent, dryRangeMax: e.target.value})}/>
                </div>
            </div>



            <div className="form-group">
                <div className="input-block mr-2">
                    <label htmlFor={`startHour`}>Allowed from (hour)</label>
                    <select
                        id={`startHour`}
                        value={intelligent.startHour || ''}
                        onChange={(e) => setIntelligent({...intelligent, startHour: e.target.value})}
                    >
                        <option value="">Any time</option>
                        {[...Array(24)].map((_, i) => (
                            <option key={i} value={i}>{i}:00</option>
                        ))}
                    </select>
                </div>
                <div className="input-block mr-2">
                    <label htmlFor={`endHour`}>Until (hour)</label>
                    <select
                        id={`endHour`}
                        value={intelligent.endHour || ''}
                        onChange={(e) => setIntelligent({...intelligent, endHour: e.target.value})}
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
