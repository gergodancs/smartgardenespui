import React from 'react';
import TrashIcon from "../icons/TrashIcon";

const MoistureBasedForm = ({index, formData, onChange, onDelete}) => {
    return (
        <div className="cycle-form">
            <div style={{
                margin: "0 0 5px 0",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                Irrigation period {index + 1}
                <TrashIcon className="trash-icon" onClick={() => onDelete(index)}/>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor={`minMoisture-${index}`}>Min moisture %</label>
                    <input
                        id={`minMoisture-${index}`}
                        type="number"
                        value={formData.minMoisture}
                        onChange={(e) => onChange(index, 'minMoisture', e.target.value)}
                    />
                </div>
                <div className="input-block">
                    <label htmlFor={`maxMoisture-${index}`}>Max moisture %</label>
                    <input
                        id={`maxMoisture-${index}`}
                        type="number"
                        value={formData.maxMoisture}
                        onChange={(e) => onChange(index, 'maxMoisture', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <div className="input-block">
                    <label htmlFor={`dryCycle-${index}`}>Dry cycle (hours)</label>
                    <input
                        id={`dryCycle-${index}`}
                        type="number"
                        value={formData.dryCycle}
                        onChange={(e) => onChange(index, 'dryCycle', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <div className="input-block mr-2">
                    <label htmlFor={`startMonth-${index}`}>Start month</label>
                    <select
                        id={`startMonth-${index}`}
                        value={formData.startMonth}
                        onChange={(e) => onChange(index, 'startMonth', e.target.value)}
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
                        value={formData.startDay}
                        onChange={(e) => onChange(index, 'startDay', e.target.value)}
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
                        value={formData.startHour || ''}
                        onChange={(e) => onChange(index, 'startHour', e.target.value)}
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
                        value={formData.endHour || ''}
                        onChange={(e) => onChange(index, 'endHour', e.target.value)}
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

export default MoistureBasedForm;
