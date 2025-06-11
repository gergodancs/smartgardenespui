import React from 'react';
import TrashIcon from "./icons/TrashIcon";

const CycleForm = ({index, formData, onChange, onDelete}) => {
    return (
        <div className="cycle-form">
            <div style={{
                margin: "0 0 5px 0",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center"
            }}>Irrigation period {index + 1}

                <TrashIcon className="trash-icon" onClick={() => onDelete(index)}/>


            </div>
            <div className="form-group">

                <input
                    type="number"
                    value={formData.minMoisture}
                    placeholder="min moisture %"
                    onChange={(e) => onChange(index, 'minMoisture', e.target.value)}
                />
                <input
                    type="number"
                    value={formData.maxMoisture}
                    placeholder="max moisture %"
                    onChange={(e) => onChange(index, 'maxMoisture', e.target.value)}
                />
            </div>

            <div className="form-group">
                <input
                    type="number"
                    placeholder="dry cycle hours"
                    value={formData.dryCycle}
                    onChange={(e) => onChange(index, 'dryCycle', e.target.value)}
                />
            </div>

            <div className="form-group">

                <select
                    value={formData.startMonth}
                    onChange={(e) => onChange(index, 'startMonth', e.target.value)}
                >
                    <option value="">Start month</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
                <select
                    value={formData.startDay}
                    onChange={(e) => onChange(index, 'startDay', e.target.value)}
                >
                    <option value="">Start day</option>
                    {[...Array(31)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

            </div>
        </div>
    );
};

export default CycleForm;