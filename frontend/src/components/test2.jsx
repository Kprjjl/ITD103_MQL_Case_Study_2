import React, { Component } from 'react';
import render from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Typography } from '@material-tailwind/react';

class TrashStatusDonut extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartOptions: {
                title: {
                    useHTML: true,
                    text: '<span style="font-size: 24px">Trash Status</span>',
                    align: 'center',
                    floating: true,
                    verticalAlign: 'middle',
                },
                subtitle: {
                    text: 'Full, Empty, Half, Quarter, Three-Quarter',
                    floating: true,
                    verticalAlign: 'middle',
                    y: 30
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: ' Trash Cans'
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
                },
                series: [
                    {
                        type: 'pie',
                        name: 'Trash Status',
                        data: [
                            ['Full', 1],
                            ['Empty', 1],
                            ['Half', 1],
                            ['Quarter', 1],
                            ['Three-Quarter', 1]
                        ]
                    }
                ],
                colors: ['#FF4136', '#A9A9A9', '#FFDC00', '#2ECC40', '#FF851B']
            }
        }
    }

    render() {
        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={this.state.chartOptions}
            />
        )
    }
}

// export default TrashStatusDonut;
