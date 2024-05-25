import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import darkTheme from '../highcharts-theme';

export function TrashStatusDonut ({ trashCans, darkMode=false }) {
    const colors = {
        "Empty": "#A9A9A9",
        "Almost Half": "#2ECC40",
        "Half": "#FFDC00",
        "Almost Full": "#FF851B",
        "Full": "#FF4136"
    };

    const [chartOptions, setChartOptions] = useState({
        chart: {
            backgroundColor: darkMode ? "transparent" : "white",
        },
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
                    format: '{point.name}: {point.percentage:.0f}%',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16px',
                        textAlign: 'center',
                        color: 'white'
                    },
                    connectorWidth: 0,
                }
            }
        }
    });

    useEffect(() => {
        if (trashCans.length > 0) {
            const levelStates = trashCans.reduce((acc, trashCan) => {
                const state = trashCan.level_state || "Empty";
                acc[state] = (acc[state] || 0) + 1;
                return acc;
            }, {});
            
            const levelStatesArray = Object.entries(levelStates).map(([state, count]) => [state, count]);
            const totalCount = trashCans.length;

            const getTitle = () => {
                return `
                    <span style="font-size: 60px">
                        <b>${totalCount}</b>
                    </span>
                `;
            };
            const getColors = () => {
                return levelStatesArray.map(([state]) => colors[state]);
            };

            setChartOptions({
                ...chartOptions,
                chart: {
                    backgroundColor: darkMode ? "transparent" : "white",
                },
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
                        data: levelStatesArray.map(([state, count]) => [state, count])
                    }
                ],
                colors: getColors()
            });
        }
    }, [trashCans, darkMode]);

    return (
        <div className={`${darkMode ? "bg-transparent": ""}`}>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
}

export default TrashStatusDonut;
