import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {userIcon} from './userIcon';

const App = () => {
  const [latLan, setLatLan] = useState({});

  const androidLocationrequest = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Tracking App',
          message: 'Tracking App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocationPermission = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await Geolocation.requestAuthorization('always');
        resolve(result);
      } catch (error) {
        reject(error);
        console.log('error==>', error);
      }
    });
  };

  useEffect(() => {
    getLocationPermission().then(res => {
      setInterval(() => {
        if (res === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              console.log('update');
              setLatLan({
                lat: position?.coords?.latitude,
                lan: position?.coords?.longitude,
              });
            },
            error => {
              console.log('error==>', error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      }, 3000);
    });
  }, []);

  return (
    <SafeAreaView style={styles.screenContain}>
      {latLan.lat && (
        <MapView
          style={styles.mapContain}
          zoomEnabled={true}
          followUserLocation={true}
          loadingEnabled={true}
          followsUserLocation={true}
          region={{
            latitude: latLan.lat || 0,
            longitude: latLan.lan || 0,
            latitudeDelta: 0.0009,
            longitudeDelta: 0.0009,
          }}
          initialRegion={{
            latitude: 0,
            longitude: 0,
          }}>
          <Marker coordinate={{latitude: latLan.lat, longitude: latLan.lan}}>
            <Image
              source={userIcon}
              style={{height: 30, width: 30, alignSelf: 'center'}}
            />
          </Marker>
          {latLan.lat && (
            <Circle
              center={{
                latitude: latLan.lat,
                longitude: latLan.lan,
              }}
              radius={5}
              strokeWidth={2}
              strokeColor="#3399ff"
              fillColor="#80bfff"
            />
          )}
        </MapView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContain: {
    backgroundColor: 'white',
    flex: 1,
  },
  mapContain: {
    backgroundColor: 'red',
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
});

export default App;
