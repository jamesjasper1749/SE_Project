Markers = new Mongo.Collection('markers'); 

Markers.allow({  
	update: function(userId, doc) { return true; },  
	remove: function(userId, doc) { return true; },
});

Meteor.methods({
	markInsert: function(markAttibutes){
     	var markerId = Markers.insert({ lat:markAttibutes.lat, lng:markAttibutes.lng });
     	return {     
		 	_id: markerId    
		};  
	}

});


