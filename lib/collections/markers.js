// Markers = new Mongo.Collection('markers'); 


// Meteor.methods({
// 	markInsert: function(markAttibutes){
//      	Markers.insert({ lat:markAttibutes.lat, lng:markAttibutes.lng });
// 	}
// });



// addMark = function(){
// 	var markers = {};
//       Markers.find().observe({
//       added: function (document) {
//         var marker = new google.maps.Marker({
//           draggable: true,
//           animation: google.maps.Animation.DROP,
//           position: new google.maps.LatLng(document.lat, document.lng),
//           map: map.instance,
//           id: document._id
//         });

//         google.maps.event.addListener(marker, 'dragend', function(event) {
//           Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
//         });

//         markers[document._id] = marker;
//       },
//       changed: function (newDocument, oldDocument) {
//         markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
//       },
//       removed: function (oldDocument) {
//         markers[oldDocument._id].setMap(null);
//         google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
//         delete markers[oldDocument._id];
//       }
//       });
// }
     