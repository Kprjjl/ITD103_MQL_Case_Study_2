import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export function TrashLevelsChart({ trashCan, trashLevelsData, lineColor, dtUnits }) {
    const xDateFormatOptions = {
        minute: "%e %b %Y %H:%M:%S",
        hour: "%e %b %Y %H:%M:%S",
        day: '%e %b',
        week: '%e %b',
        month: '%b \'%y',
        year: '%Y',
    };
    const [data, setData] = useState([]);
    const [chartOptions, setChartOptions] = useState({
        title: {
            text: "",
        },
        yAxis: {
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
        yAxis: {
            title: {
                text: "Trash Level (cm)",
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
        const fetchLevelDataByUnits = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/trash-level/${trashCan._id}/${dtUnits}`);
                const formattedData = response.data.map(({ _id, averageFillLevel }) => [new Date(_id).getTime(), averageFillLevel]);
                setData(formattedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLevelDataByUnits();
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            yAxis: {
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
                    data: data,
                    color: lineColor,
                },
            ],
        }));
    }, [trashCan, trashLevelsData, lineColor, dtUnits]);

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
