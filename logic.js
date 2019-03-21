function UsersChartPlot( chartDiv, chartLegend, url ) {

	var div = jQuery( chartDiv );
	var legendContainer = jQuery(chartLegend );

	function legendFormatter(label, series) {
		return '<div style="color:' + series.color + '">' + series.data[ series.data.length - 1 ][1] + '</div>';
	};

	function onDataReceived(series) {
		var plot = jQuery.plot(div, series, {
			series: {
				lines: {
					show: true,
					fill: false
				},
				bars: {
					show: false
				}
			},
			legend: {
				show: true,
				backgroundColor: '#c98d3',
				position: "sw",
				margin: 0,
				labelBoxBorderColor: 'black'
			},
			yaxis: {
				show: true,
				tickFormatter: (function (d) {
					return nFormatter(d);
				}),
				tickColor: '#323232',
				autoscaleMargin: 0.15,
			},
			xaxis: {
				show: true,
				mode: "time",
				minTickSize: [1, "hour"],
				ticks: 20,
				labelWidth: '100',
				alignTicksWithAxis: 1,
				tickFormatter: (function (val, axis) {
					var d = new Date(val);
					var crossedDay = ( axis.lastDate == null || d.getDay() != axis.lastDate.getDay() )
					axis.lastDate = d;
					if ( axis.ticks.length == 0 || crossedDay)
					{
						return '<div class="dateAxis">' + d.toLocaleDateString( navigator.language, {  year: '2-digit', month: 'short', day: 'numeric' }) + '</div>';

					}
					else
					{
						return d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
					}
				}),
				lastDate: null,
				tickColor: '#232628'
			},
			grid: {
				hoverable: true,
				clickable: false,
				borderWidth: 0,
				backgroundColor: '#232628'
			}
		});

		div.bind("plothover", function (event, pos, item) {
			if (item) {
				var x = (item.datapoint[1] ).toFixed(0);
				var date = new Date( item.datapoint[0] );
				jQuery("#charttooltip").html( date.toLocaleTimeString() + ' ' + x + ' USERS'  )
					.css({top: item.pageY-30, left: item.pageX-25})
					.fadeIn(200);
			} else {
				jQuery("#charttooltip").hide();
			}
		} );
	}

	jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		success: onDataReceived
	});
}