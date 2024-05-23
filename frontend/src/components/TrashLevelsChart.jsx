import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function TrashLevelsChart ({ trash }) {
    const formatOptions = {
        "datetime": "%Y-%m-%d %H:%M:%S",
        "date": "%Y-%m-%d",
        "time": "%H:%M:%S",
    }
    const [datetimeFormat, setDatetimeFormat] = useState("time")
    const [trashLevelsData, setTrashLevelsData] = useState([]);
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
            series: {
            }
        },
        series: [],
    });

    useEffect(() => {
        const fetchTrashLevelsData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/trash-level/${trash._id}`);
                const formattedData = response.data.map(([timestamp, level]) => [new Date(timestamp).getTime(), level]);
                setTrashLevelsData(formattedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTrashLevelsData();
    }, [trash]);

    useEffect(() => {
        if (trashLevelsData && trashLevelsData.length > 0) {
            setChartOptions({
                ...chartOptions,
                series: [
                    {
                        type: 'line',
                        name: 'Trash Level',
                        data: trashLevelsData,
                        color: "red"
                    }
                ],
            });
        }
    }, [trashLevelsData]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    )
}

export default TrashLevelsChart;
