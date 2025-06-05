import React from "react";

const Zone = ({ setZone, setVisible }) => {
    const zones = [1, 2, 3, 4, 5, 6];

    const handleClick = (zoneNumber) => {
        setZone(zoneNumber);
        setVisible(true);
    };

    return (
        <div className="zones-wrapper">
            {zones.map((zone) => (
                <div key={zone} className="zone" onClick={() => handleClick(zone)}>
                    ZONE {zone}
                </div>
            ))}
        </div>
    );
};

export default Zone;
