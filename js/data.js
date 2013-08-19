function randomData () {
	var data = [], t = (new Date("Sat Jan 01 2011 00:00:00")).getTime(), SECOND = 1000, MINUTE = 60 * SECOND;
	for (var i = 0; i < 23; i++) {
		data.push(
			{
				time: t + ((i + 1) * 15 * SECOND),
				value: parseInt(50 * Math.random(50), 10)
			}	
		);
		data.push(
			{
				time: t + ((i + 1) * 15 * SECOND),
				value: -parseInt(50 * Math.random(50), 10)
			}	
		);		
	};
	return data;
}