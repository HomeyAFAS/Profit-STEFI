'use strict';

var dgram = require('dgram');
var host = '192.168.2.14', port = 1634;
var client = dgram.createSocket( 'udp4' );
var deviceTypes = {
	zonwering: 'sun',
	tv: 'tv'
}

module.exports = {
	handleAction: function(deviceType, device, deviceState, callback){
		var error;

		switch(deviceType){
			case deviceTypes.zonwering:
				switch(deviceState) {
					case 'up':
					case 'down':
					case 'idle':
						var message = Buffer.from(device.data[deviceState], 'hex');
						break;

					default:
						error = 'Zonwering actie niet ondersteund';
						break;
				}
				break;

			case deviceTypes.tv:
				switch(deviceState) {
					case 'on':
					case 'off':
						var message = Buffer.from(device.data[deviceState], 'hex');
						break;

					default:
						error = 'TV actie niet ondersteund';
						break;
				}
				break;

			default:
				error = 'Apparaat niet ondersteund';
				break;
		}
		if(error) return callback(error, false);

		if(message){
			Homey.log(message);
			client.send(message, 0, message.length, port, host );
			callback(deviceState, true);
		} else {
			return callback('Er is iets mis met het bericht', false);
		}
	},
	deviceTypes: deviceTypes
}