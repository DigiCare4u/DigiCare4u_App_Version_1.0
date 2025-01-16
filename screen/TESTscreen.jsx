import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { devURL } from '../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLocation from '../hooks/useLocation';
import Goback from '../components/GoBack';
import Loader from '../components/Loader';

import { Alert, Linking } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import { getDistanceFromLatLonInMeters } from '../services/util/distanceMatrix';
import { updateLocationIfNeeded_bg } from '../services/coreTracking';
import useFetchMember from '../hooks/useFetchMember';

function TESTscreen({ navigation, item }) {
  

  return (
    <SafeAreaView style={styles.container}>
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: '50%',
    width: '100%',
  },
  // Info Box Styles
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },

  // Action Buttons Styles
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionMarkedCompleteButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionStopButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },


  // Text Container Styles
  textContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007BFF',
    textAlign: 'center',
  },
});


export default TESTscreen;
