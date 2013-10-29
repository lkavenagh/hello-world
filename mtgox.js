var conn = io.connect('https://socketio.mtgox.com/mtgox?Currency=USD');
conn.send({
	"op":"mtgox.subscribe",
	"type":"trades"
});
conn.send({
	"op":"mtgox.subscribe",
	"type":"depth"
});
conn.send({
	"op":"mtgox.subscribe",
	"type":"ticker"
});
document.getElementById("statuslabel").innerHTML = "<font color=green>Connected to Mt.Gox</font>";
var date;
var tradetime;
conn.on('message', function(data) {
	if ('private' === data.op) {
		if ('trade' === data.private && 'USD' === data.trade.price_currency) {
			date = new Date(data.trade.date*1000);
			tradetime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			document.getElementById("tradepricelabel").innerHTML = "Last trade price: ";
			document.getElementById("tradeprice").innerHTML = tradetime + " - " + data.trade.price.toString();
		}
		if ('depth' === data.private) {
			if ('ask' === data.depth.type_str) {
				document.getElementById("askpricelabel").innerHTML = "Ask price:";
				document.getElementById("askprice").innerHTML = data.depth.price.toString();
			} else {
				document.getElementById("bidpricelabel").innerHTML = "Bid price";
				document.getElementById("bidprice").innerHTML = data.depth.price.toString();
			}
		}
	}
});
conn.on('disconnect', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=red>Not connected to Mt.Gox</font>";
});