/**
 * Statistics manager
 */
T.Managers.StatisticsManager = new function () {
    var self = this;

    self.SCALE_DAY      = 'day';
    self.SCALE_MONTH    = 'month';

    /**
     * Check if stats filter data is valid
     * data['scale'] - scale
     * data['from'] - from date
     * data['to'] - to date
     * @param data
     */
    self.validFilterData = function (data, successCallback, errorCallback) {
        var from = data['from'];
        var to = data['to'];
        var scale = data['scale'];

        if (!from || !to || !scale) {
            T.System.errorLog('T.Managers.StatisticsManager.validateStatsFilterData: Params invalid');
            return false;
        }

        from = new Date(data['from']);
        to = new Date(data['to']);

        var diff = T.Utils.daysDiff(from, to);

        if (scale == self.SCALE_DAY) {
            if (diff < 1 || diff > 120) {
                return false;
            }
        }
        else if (scale == self.SCALE_MONTH) {
            if (diff < 28 || diff > 120 * 30) {
                return false;
            }
        }

        return true;
    };

    /**
     * Insert point details block in container
     * @param container
     */
    self.insertPointDetails = function (insertData) {
        var container = insertData['container'];
        var data = insertData['data'];

        if (!container || !data) {
            T.System.errorLog('T.Managers.StatisticsManager.insertPointDetails: Params invalid');
            return;
        }

        var template = T.Templates.getTemplate('dynamics-graph-point-details');

        template = $(template.html());
        template = new T.UI.Container(template);
        template.fill(data);

        container.insert({ template : template });
    };

    //Converts the ajax Stat request in html
    self.showDynamicsGraph = function(container, detailsBlock, callback) {
        var voc = T.Vocabularies.getVocabulary();
        var statsData = T.Managers.DataManager.getStatsData();
        var scale = statsData['scale'];

        container.show();
        detailsBlock.show();

        window.chart = new Highcharts.Chart({
            chart : {
                renderTo : container.getId(),
                height: 450
            },

            rangeSelector : {
                selected : 1
            },
            title: {
                text: '',
                x: -20
            },
            tooltip: {
                formatter: function() {
                    if (scale == self.SCALE_DAY)
                        return '<b>'+ this.series.name +'</b><br/>'+
                            Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y;
                    else
                        return '<b>'+ this.series.name +'</b><br/>'+
                            Highcharts.dateFormat('%b', this.x) +': '+ this.y;
                }
            },
            legend: {
                layout: 'horizontal',
                floating: true,
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                y: 520,
                x: 30
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: (scale == self.SCALE_DAY)? '%e. %b' : '%b',
                    year: '%b'
                }
            },
            yAxis:
                [
                    {
                        min : 0,
                        title: {
                            text: ''
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        }
                    },
                    {
                        min : 0,
                        title: {
                            text: voc.tWord('orders')
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        },
                        opposite : true
                    }
                ],
            series :
                [
                    {
                        name : voc.tWord('orders_num'),
                        type: 'column',
                        yAxis: 1,
                        data : statsData['orders_num'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('paid_orders'),
                        type: 'column',
                        yAxis: 1,
                        data : statsData['paid_orders'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('repaid_orders'),
                        type: 'column',
                        yAxis: 1,
                        data : statsData['repaid_orders'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('amount_in'),
                        type: 'spline',
                        data : statsData['amount_in'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('amount_out'),
                        type: 'spline',
                        data : statsData['amount_out'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('rate'),
                        type: 'spline',
                        data : statsData['amount_percent'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    {
                        name : voc.tWord('penalty_rate'),
                        type: 'spline',
                        data : statsData['amount_penalty'],
                        tooltip: {
                            valueDecimals: 2
                        }
                    }
                ],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                var point = this;

                                var pointValues = {};
                                pointValues['date'] = point.x;

                                $.each(statsData['amount_in'], function(key, value)
                                {
                                    if (value[0] == point.x)
                                    {
                                        pointValues['amount_in'] = value[1];
                                    }
                                });

                                $.each(statsData['amount_out'], function(key, value)
                                {
                                    if (value[0] == point.x)
                                    {
                                        pointValues['amount_out'] = value[1];
                                    }
                                });

                                $.each(statsData['amount_percent'], function(key, value)
                                {
                                    if (value[0] == point.x)
                                    {
                                        pointValues['amount_percent'] = value[1];
                                    }
                                });

                                $.each(statsData['amount_penalty'], function(key, value)
                                {
                                    if (value[0] == point.x)
                                    {
                                        pointValues['amount_penalty'] = value[1];
                                    }
                                });


                                pointValues['date'] = new Date(pointValues['date']);

                                if (scale == self.SCALE_DAY) {
                                    pointValues['date'] = T.Vocabularies.getVocabulary().fullDate(
                                        pointValues['date'].getFullYear(),
                                        pointValues['date'].getMonth(),
                                        pointValues['date'].getDate()
                                    );
                                } else {
                                    pointValues['date'] = T.Vocabularies.getVocabulary().fullDate(
                                        pointValues['date'].getFullYear(),
                                        pointValues['date'].getMonth()
                                    );
                                }

                                self.insertPointDetails({ container : detailsBlock, data : pointValues });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                },
                column_: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            }
        });

        Highcharts.setOptions({
            lang: {
                shortMonths : [
                    voc.tWord('jan'),
                    voc.tWord('feb'),
                    voc.tWord('mar'),
                    voc.tWord('apr'),
                    voc.tWord('may'),
                    voc.tWord('jun'),
                    voc.tWord('jul'),
                    voc.tWord('aug'),
                    voc.tWord('sep'),
                    voc.tWord('oct'),
                    voc.tWord('nov'),
                    voc.tWord('dec')]
            }
        });

        if (callback) {
            callback();
        }
    };

    self.showStaticDistributionGraphs = function (graphs) {
        var distrData = T.Managers.DataManager.getStatsDistribution();
        var voc = T.Vocabularies.getVocabulary();

        /**
         * Orders to clients bars
         * @type {Chart}
         */
        window.chart = new Highcharts.Chart({
            chart: {
                renderTo : graphs['orders_to_clients_graph'].getId(),
                type: 'bar',
                height : 200,
                width : 580
            },
            title: {
                text: '',
                x: -20
            },
            xAxis: {
                title: {
                    text: voc.tWord('orders')
                },
                categories : distrData['orders_to_clients']['orders']
            },
            yAxis: {
                title: {
                    text: voc.tWord('clients_count')
                }
            },
            legend: {
                y: 520,
                x: 30
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name : voc.tWord('clients'),
                data : distrData['orders_to_clients']['clients']
            }]
        });

        /**
         * Clients to amounts bars
         * @type {Chart}
         */
        window.chart = new Highcharts.Chart({
            chart: {
                renderTo : graphs['clients_to_amounts_graph'].getId(),
                type: 'bar',
                height : 200,
                width : 580
            },
            title: {
                text: '',
                x: -20
            },
            xAxis: {
                title: {
                    text: voc.tWord('order_amount')
                },
                categories : distrData['clients_to_amounts']['amounts']
            },
            yAxis: {
                title: {
                    text: voc.tWord('clients_count')
                }
            },
            legend: {
                y: 520,
                x: 30
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name : voc.tWord('clients'),
                data : distrData['clients_to_amounts']['clients']
            }]
        });

        /**
         * Clients to periods bars
         * @type {Chart}
         */
        window.chart = new Highcharts.Chart({
            chart: {
                renderTo : graphs['clients_to_periods_graph'].getId(),
                type: 'bar',
                height : 200,
                width : 580
            },
            title: {
                text: '',
                x: -20
            },
            xAxis: {
                title: {
                    text: voc.tWord('overdue_days')
                },
                categories : distrData['clients_to_periods']['intervals']
            },
            yAxis: {
                title: {
                    text: voc.tWord('clients_count')
                }
            },
            legend: {
                y: 520,
                x: 30
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name : voc.tWord('clients'),
                data : distrData['clients_to_periods']['clients']
            }]
        });

        /**
         * Clients to expired orders bars
         * @type {Chart}
         */
        window.chart = new Highcharts.Chart({
            chart: {
                renderTo : graphs['clients_to_exp_orders_graph'].getId(),
                type: 'bar',
                height : 200,
                width : 580
            },
            title: {
                text: '',
                x: -20
            },
            xAxis: {
                title: {
                    text: voc.tWord('overdue_orders')
                },
                categories : distrData['clients_to_exp_orders']['orders']
            },
            yAxis: {
                title: {
                    text: voc.tWord('clients_count')
                }
            },
            legend: {
                y: 520,
                x: 30
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name : voc.tWord('clients'),
                data : distrData['clients_to_exp_orders']['clients']
            }]
        });
    };
};