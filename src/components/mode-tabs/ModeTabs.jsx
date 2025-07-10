import React from 'react'

const ModeTabs = ({mode, setMode}) => {
    return (
        <div className="mode-tabs">
            <div style={{display: "flex", gap: "2px"}}>
                <button style={{width: '100%'}}
                        className={`tab-button ${mode === 'intelligent-dry-cycle' ? 'active' : ''}`}
                        onClick={() => setMode('intelligent-dry-cycle')}>
                    Full control
                </button>
                <button style={{width: '100%'}}
                        className={`tab-button ${mode === 'moisture-cycles' ? 'active' : ''}`}
                        onClick={() => setMode('moisture-cycles')}>
                    Moisture based
                </button>
            </div>
            <div style={{display: "flex", gap: "2px"}}>
                <button style={{width: '100%'}}
                        className={`tab-button ${mode === 'interval-max' ? 'active' : ''}`}
                        onClick={() => setMode('interval-max')}>Interval (max)
                </button>
                <button style={{width: '100%'}}
                        className={`tab-button ${mode === 'interval-duration' ? 'active' : ''}`}
                        onClick={() => setMode('interval-duration')}>Interval (duration)
                </button>
            </div>
        </div>
    )
}
export default ModeTabs;