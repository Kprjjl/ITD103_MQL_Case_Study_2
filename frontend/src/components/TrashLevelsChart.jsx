import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export function TrashLevelsChart({ trashCan, trashLevelsData, lineColor, dtUnits }) {
    const formatOptions = {
        "datetime": "%Y-%m-%d %H:%M:%S",
        "date": "%Y-%m-%d",
        "time": "%H:%M:%S",
    };

    const [data, setData] = useState([]);
    const [datetimeFormat, setDatetimeFormat] = useState("time");
    const [chartOptions, setChartOptions] = useState({
        title: {
            text: "",
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: "Timestamp",
            },
            labels: {
                rotation: -45,
                step: 1,
            },
            dateTimeLabelFormats: {
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
        },
        tooltip: {
            xDateFormat: formatOptions[datetimeFormat],
            valueSuffix: "cm",
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
            tooltip: {
                ...prevOptions.tooltip,
                xDateFormat: formatOptions[datetimeFormat],
            },
            series: [
                {
                    ...prevOptions.series[0],
                    data: data,
                    color: lineColor,
                },
            ],
        }));
    }, [trashCan, trashLevelsData, datetimeFormat, lineColor, dtUnits]);

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
