'use client';

export default function TabSwitcher({ tabs, activeTab, onChange }) {
    return (
        <ul className="nav nav-tabs mb-4 justify-content-center">
            {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                    <button
                        className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => onChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}
