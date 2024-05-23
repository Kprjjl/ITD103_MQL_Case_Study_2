import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function TrashStatusDonut () {
    const colors = {
        "Empty": "#A9A9A9",
        "Quarter": "#2ECC40",
        "Half": "#FFDC00",
        "Three-Quarter": "#FF851B",
        "Full": "#FF4136"
    }
    const [trashStateData, setTrashStateData] = useState([]);
    const [totalTrashCans, setTotalTrashCans] = useState(0);
    const [chartOptions, setChartOptions] = useState({
        title: {
            text: "",
            floating: true,
            verticalAlign: 'middle'
        },
        subtitle: {
            useHTML: true,
            text: `<span style="font-size: 24px">Trash Can/s</span>`,
            floating: true,
            verticalAlign: 'middle',
            y: 30
        },
        legend: {
            enabled: false
        },
        tooltip: {
            valueDecimals: 0,
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                colorByPoint: true,
                type: 'pie',
                size: '100%',
                innerSize: '80%',
                dataLabels: {
                    enabled: true,
                    crop: false,
                    distance: '-10%',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16px'
                    },
                    connectorWidth: 0
                }
            }
        }
    });

    useEffect(() => {
        const fetchTrashStateData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/level-states');
                setTrashStateData(response.data.levelStates);
                setTotalTrashCans(response.data.totalCount);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTrashStateData();
    }, []);

    useEffect(() => {
        const getTitle = () => {
            return `
                <span style="font-size: 60px">
                    <b>${totalTrashCans}</b>
                </span>
            `;
        };
        const getColors = () => {
            return trashStateData.map(([state, count]) => colors[state]);
        };
        if (trashStateData.length > 0) {
            setChartOptions({
                ...chartOptions,
                title: {
                    useHTML: true,
                    text: getTitle(),
                    align: 'center',
                    floating: true,
                    verticalAlign: 'middle',
                    y: -20
                },
                series: [
                    {
                        type: 'pie',
                        name: 'No. of Trash Cans',
                        data: trashStateData.map(([state, count]) => [`${state} Level`, count])
                    }
                ],
                colors: getColors()
            });
        }
    }, [trashStateData, totalTrashCans]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    )
}

export default TrashStatusDonut;
