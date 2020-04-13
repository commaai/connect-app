function regionBoundingPath(coords) {
  if (coords.length == 0) {
    return;
  }

  let latSum = 0, lngSum = 0;
  let minLat = Number.MAX_VALUE, minLng = Number.MAX_VALUE;
  let maxLat = -Number.MAX_VALUE, maxLng = -Number.MAX_VALUE;

  coords.forEach((coord, index) => {
    if (coord.lat > maxLat) {
      maxLat = coord.lat;
    }
    if (coord.lng > maxLng) {
      maxLng = coord.lng;
    }
    if (coord.lng < minLng) {
      minLng = coord.lng;
    }
    if (coord.lat < minLat) {
      minLat = coord.lat;
    }
    latSum += coord.lat;
    lngSum += coord.lng;
  })

  let latCentroid = latSum / coords.length;
  let lngCentroid = lngSum / coords.length;

  return {
    latitude: latCentroid,
    longitude: lngCentroid,
    latitudeDelta: 1.3 * Math.abs(maxLat - minLat),
    longitudeDelta: 1.3 * Math.abs(maxLng - minLng)
  };
}

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export default { regionBoundingPath, calculateDistance };
