import React from "react";

const GenericCycleList = ({cycles, setCycles, type}) => {
    const handleChange = (index, field, value) => {
        const updated = [...cycles];
        updated[index][field] = value;
        setCycles(updated);
    };

    const addCycle = () => {
        const emptyCycle = {
            intervalDays: '',
            ...(type === 'interval-max' ? {maxMoisture: ''} : {durationMinutes: ''}),
            startMonth: '',
            startDay: '',
            startHour: '',
            endHour: ''
        };
        setCycles([...cycles, emptyCycle]);
    };

    return (
        <>
            {cycles.map((cycle, index) => (
                <div className="cycle-form" key={index}>
                    <div className="form-group">
                        <div className="input-block">
                            <label htmlFor={`intervalDays-${index}`}>Interval (days)</label>
                            <input
                                id={`intervalDays-${index}`}
                                type="number"
                                value={cycle.intervalDays}
                                onChange={(e) => handleChange(index, 'intervalDays', e.target.value)}
                            />
                        </div>

                        {type === 'interval-max' ? (
                            <div className="input-block">
                                <label htmlFor={`maxMoisture-${index}`}>Max moisture %</label>
                                <input
                                    id={`maxMoisture-${index}`}
                                    type="number"
                                    value={cycle.maxMoisture}
                                    onChange={(e) => handleChange(index, 'maxMoisture', e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="input-block">
                                <label htmlFor={`durationMinutes-${index}`}>Duration (minutes)</label>
                                <input
                                    id={`durationMinutes-${index}`}
                                    type="number"
                                    value={cycle.durationMinutes}
                                    onChange={(e) => handleChange(index, 'durationMinutes', e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="input-block mr-2">
                            <label htmlFor={`startMonth-${index}`}>Start month</label>
                            <select
                                id={`startMonth-${index}`}
                                value={cycle.startMonth}
                                onChange={(e) => handleChange(index, 'startMonth', e.target.value)}
                            >
                                <option value="">Select month</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-block mr-2">
                            <label htmlFor={`startDay-${index}`}>Start day</label>
                            <select
                                id={`startDay-${index}`}
                                value={cycle.startDay}
                                onChange={(e) => handleChange(index, 'startDay', e.target.value)}
                            >
                                <option value="">Select day</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-block mr-2">
                            <label htmlFor={`startHour-${index}`}>Allowed from (hour)</label>
                            <select
                                id={`startHour-${index}`}
                                value={cycle.startHour || ''}
                                onChange={(e) => handleChange(index, 'startHour', e.target.value)}
                            >
                                <option value="">Any time</option>
                                {[...Array(24)].map((_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-block mr-2">
                            <label htmlFor={`endHour-${index}`}>Until (hour)</label>
                            <select
                                id={`endHour-${index}`}
                                value={cycle.endHour || ''}
                                onChange={(e) => handleChange(index, 'endHour', e.target.value)}
                            >
                                <option value="">Any time</option>
                                {[...Array(24)].map((_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            <button className="add-period" onClick={addCycle}>Add Period</button>
        </>
    );
};

export default GenericCycleList;
