declare module 'react-calendar-heatmap' {
    import React from 'react';

    export interface HeatmapValue {
        date: string;
        count: number;
    }

    export interface CalendarHeatmapProps {
        startDate: Date;
        endDate: Date;
        values: HeatmapValue[];
        classForValue?: (value: HeatmapValue) => string;
        tooltipDataAttrs?: (value: HeatmapValue) => any;
    }

    const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
    export default CalendarHeatmap;
}
