"use client";

import { Search, Grid3x3, List } from "lucide-react";

interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    years: string[];
}

export default function FilterBar({
    searchQuery,
    setSearchQuery,
    selectedYear,
    setSelectedYear,
    viewMode,
    setViewMode,
    years,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-controls">
                {/* Search */}
                <div className="filter-search">
                    <Search size={14} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Year Filter */}
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="year-select"
                >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* View Toggle */}
            <div className="view-toggle">
                <button
                    className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid View"
                >
                    <Grid3x3 size={16} />
                </button>
                <button
                    className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List View"
                >
                    <List size={16} />
                </button>
            </div>
        </div>
    );
}
