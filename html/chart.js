var chart =
{
	context: {},
	width: 280,
	height: 180,
	numYSeparators: 6,
	numXSeparators: 4,
	maxTemperature: 40,
	minTemperature: 10,
	
	calcYPosition: function(value) 
	{
		if (value > this.maxTemperature) {
			value = this.maxTemperature;
		}
		if (value < this.minTemperature) {
			value = this.minTemperature;
		}
		var ret = this.height - (value - this.minTemperature) * (this.height / (this.maxTemperature - this.minTemperature));
		return ret;
	},
	
	drawCurve: function(data, sensor, width, height)
	{
		if (sensor) {
			this.context.strokeStyle = "#69B3E7"; 
		} else {
			this.context.strokeStyle = "#074995";
		}
		this.context.lineWidth = 2;
		this.context.lineCap = 'round'; 
		this.context.lineJoin = 'round';
		this.context.beginPath(); 
		var value;
		if (sensor) {
			value = data[0].sensor0.temperature.value;
		} else {
			value = data[0].wall_router0.temperature.value;
		}
		this.context.moveTo(width, this.calcYPosition(value)); 
		
		var i = 0;
		var xPosition = width - 3;
		for (i = data.length - 2; (i > 0) && (xPosition > 0); i--) {
		for (i = 1; (i < data.length) && (xPosition > 0); ++i) {
			if (sensor) {			
				value = data[i].sensor0.temperature.value;
			} else {
				value = data[i].wall_router0.temperature.value;
			}
			this.context.lineTo(xPosition, this.calcYPosition(value));
			xPosition -= 3;
		}
		this.context.stroke(); 			
		this.context.closePath();	
	},
	
	drawYSeparators: function()
	{
		this.context.strokeStyle = '#dddddd';
		this.context.lineWidth = 1;
		this.context.lineCap = 'square'; 
		this.context.beginPath(); 

		var i;
		for (i = 0; i < this.numYSeparators; ++i) {
			var xPosition = i * (this.width/(this.numYSeparators - 1));
			if (xPosition === 0) {
				xPosition = 1;
			} else if (xPosition === this.width) {
				xPosition -= 1;
			}
			
			this.context.beginPath();
			this.context.moveTo(xPosition, 0);
			this.context.lineTo(xPosition, this.height);
			this.context.stroke();
			this.context.closePath();
		}
	},
	
	labelYAxis: function()
	{
		this.context.font = "10px sans-serif";
		this.context.fillStyle = "#0000dd";
		
		var i;
		var increment = (this.maxTemperature - this.minTemperature)/(this.numXSeparators - 1);
		var label = this.maxTemperature;
		for (i = 0; i < this.numXSeparators; ++i) {
			var yPosition = i * (this.height/(this.numXSeparators - 1));
			if (yPosition === 0) {
				yPosition += 7;
			}
			
			this.context.fillText(label, this.width+5, yPosition);
			label -= increment;
		}
	},
	
	labelXAxis: function()
	{
		this.context.font = "10px sans-serif";
		this.context.fillStyle = "#0000dd";
		
		var i;
		var increment = 24/(this.numYSeparators - 1);
		var label = 24 - increment;
		for (i = 1; i < (this.numYSeparators - 1); ++i) {
			var xPosition = i * (this.width/(this.numYSeparators - 1)) - 5;
			if (i >= (this.numYSeparators - 2)) {
				xPosition += 3;
			}
			
			this.context.fillText(Math.round(label), xPosition, this.height + 10);
			label -= increment;
		}
		this.context.fillStyle = "#aaaaaa";		
		this.context.fillText("Hours", this.width/2, this.height + 20);		
	},
	
	draw: function(data, context)
	{
		this.context = context;
		
		this.drawYSeparators();
		this.labelYAxis();
		this.labelXAxis();
		
		this.drawCurve(data, true, this.width, this.height);
		this.drawCurve(data, false, this.width, this.height); 
	}
};
