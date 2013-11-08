var conn = io.connect('https://socketio.mtgox.com/mtgox');

var date;
var tradetime;

conn.on('connect', function(data) {
	document.getElementById("statuslabel").innerHTML = "<pgreen>Connected to Mt.Gox</pgreen>";
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "ticker"
	});
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "depth"
	});
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "trade"
	});
});

conn.on('message', function(data) {
	if ('private' === data.op) {
		if ('trade' === data.private && 'USD' === data.trade.price_currency) {
			date = new Date(data.trade.date*1000);
			tradetime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			document.getElementById("tradepricelabel").innerHTML = "<p>Last trade price:</p> ";
			document.getElementById("tradeprice").innerHTML = "<p>" + tradetime + " - " + data.trade.price.toString() + "</p>";
		}
		if ('depth' === data.private) {
			if ('ask' === data.depth.type_str) {
				document.getElementById("askpricelabel").innerHTML = "<p>Ask price:</p>";
				document.getElementById("askprice").innerHTML = "<p>" + data.depth.price.toString() + "</p>";
			} else {
				document.getElementById("bidpricelabel").innerHTML = "Bid price</p>";
				document.getElementById("bidprice").innerHTML = "<p>" + data.depth.price.toString() + "</p>";
			}
		}
	}
});

conn.on('heartbeat', function(data) {
	document.getElementById("statuslabel").innerHTML = "<pblue>Heartbeat</pblue>";
});

conn.on('connecting', function(data) {
	document.getElementById("statuslabel").innerHTML = "<pred>Connecting...</pred>";
});

conn.on('disconnect', function(data) {
	document.getElementById("statuslabel").innerHTML = "<pred>Not connected to Mt.Gox</pred>";
});

conn.on('error', function(data) {
	document.getElementById("statuslabel").innerHTML = "<pred>Error connecting to Mt.Gox</pred>";
});