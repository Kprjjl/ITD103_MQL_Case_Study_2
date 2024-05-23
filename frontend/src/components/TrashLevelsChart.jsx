import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export function TrashLevelsChart({ trashLevelsData, lineColor }) {
    const formatOptions = {
        "datetime": "%Y-%m-%d %H:%M:%S",
        "date": "%Y-%m-%d",
        "time": "%H:%M:%S",
    };

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
                format: `{value:${formatOptions[datetimeFormat]}}`,
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
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            xAxis: {
                ...prevOptions.xAxis,
                labels: {
                    format: `{value:${formatOptions[datetimeFormat]}}`,
                },
            },
            tooltip: {
                ...prevOptions.tooltip,
                xDateFormat: formatOptions[datetimeFormat],
            },
            series: [
                {
                    ...prevOptions.series[0],
                    data: trashLevelsData,
                    color: lineColor,
                },
            ],
        }));
    }, [trashLevelsData, datetimeFormat, lineColor]);

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
