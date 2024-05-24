import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import darkTheme from '../highcharts-theme';

export function TrashLevelsChart({ trashCan, trashLevelsData, lineColor, dtUnits, darkMode=false }) {

    const xDateFormatOptions = {
        minute: "%e %b %Y %H:%M:%S",
        hour: "%e %b %Y %H:%M:%S",
        day: '%e %b',
        week: '%e %b',
        month: '%b \'%y',
        year: '%Y',
    };
    const [chartOptions, setChartOptions] = useState({
        title: {
            text: "",
        },
        yAxis: {
            title: {
                text: "Trash Level (cm)",
            },
            labels: {
                format: '{value:.0f}'
            }
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: "Timestamp",
            },
            labels: {
                // rotation: -45,
                step: 1,
            },
            dateTimeLabelFormats: {
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
        },
        tooltip: {
            xDateFormat: xDateFormatOptions[dtUnits],
            valueSuffix: "cm",
            formatter: function () {
                return `${Highcharts.dateFormat(xDateFormatOptions[dtUnits], this.x)}<br>
                    <span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y.toFixed(0)} cm</b>`;
            },
        },
        plotOptions: {
            series: {},
        },
        series: [
            {
                type: 'line',
                name: 'Trash Level',
                data: trashLevelsData,
                color: lineColor,
            },
        ],
    });

    useEffect(() => {
        console.log("dtUnits", dtUnits)
        let formattedData = [];
        const fetchLevelDataByUnits = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/trash-level/${trashCan._id}/${dtUnits}`);
                formattedData = response.data.map(({ _id, averageFillLevel }) => [new Date(_id).getTime(), averageFillLevel]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLevelDataByUnits().then(() => {
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                yAxis: {
                    title: {
                        text: "Trash Level (cm)",
                    },
                    labels: {
                        format: '{value:.0f}'
                    }
                },
                tooltip: {
                    ...prevOptions.tooltip,
                    xDateFormat: xDateFormatOptions[dtUnits],
                    formatter: function () {
                        return `${Highcharts.dateFormat(xDateFormatOptions[dtUnits], this.x)}<br>
                            <span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y.toFixed(0)} cm</b>`;
                    },
                },
                series: [
                    {
                        ...prevOptions.series[0],
                        data: formattedData,
                        color: lineColor,
                    },
                ],
            }));
        });

        
        if (darkMode) {
            Highcharts.setOptions(darkTheme);
        } else {
            Highcharts.setOptions(Highcharts.getOptions()); // Reset to default
        }
    }, [trashCan, trashLevelsData, lineColor, dtUnits, darkMode]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
}

export default TrashLevelsChart;
