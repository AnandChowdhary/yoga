/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  AsyncStorage
} from 'react-native';
import AppleHealthKit from 'rn-apple-healthkit';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { getAlLData } from './healthkit';
const PERMISSIONS = AppleHealthKit.Constants.Permissions;

const getHealthData = () => {
  return new Promise((resolve, reject) => {
    let options = {
      permissions: {
        read: [
          PERMISSIONS.ActiveEnergyBurned,
          PERMISSIONS.BasalEnergyBurned,
          PERMISSIONS.BiologicalSex,
          PERMISSIONS.BloodGlucose,
          PERMISSIONS.BloodPressureDiastolic,
          PERMISSIONS.BloodPressureSystolic,
          PERMISSIONS.BodyMassIndex,
          PERMISSIONS.BodyTemperature,
          PERMISSIONS.DateOfBirth,
          PERMISSIONS.DistanceCycling,
          PERMISSIONS.DistanceWalkingRunning,
          PERMISSIONS.FlightsClimbed,
          PERMISSIONS.HeartRate,
          PERMISSIONS.Height,
          PERMISSIONS.LeanBodyMass,
          PERMISSIONS.RespiratoryRate,
          PERMISSIONS.SleepAnalysis,
          PERMISSIONS.StepCount,
          PERMISSIONS.Steps,
          PERMISSIONS.Weight,
          PERMISSIONS.BodyFatPercentage
        ]
      }
    };
    AppleHealthKit.initHealthKit(options, error => {
      if (error) return reject(error);
      getAlLData()
        .then(data => {
          resolve(data);
        })
        .catch((error) => reject(error));
    });
  });
}

const App: () => React$Node = () => {
  const [lastTriggered, setLastTriggered] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem("lastTriggered")
      .then(val => {
        console.log(val, "GOT VALUE", new Date());
        if (val) setLastTriggered(new Date(parseInt(val)));
      })
      .catch(() => {})
  }, []);
  const saveData = () => {
    getHealthData()
    .then(data => {
      // console.log("I got health data", data);
    })
      .then(() => setLastTriggered(new Date()))
      .then(() => AsyncStorage.setItem("lastTriggered", new Date().getTime().toString()))
      .catch(() => alert("I got an error in saving this data"))
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Yoga</Text>
              <Text style={styles.sectionDescription}>
                Yoga find your health data using <Text style={styles.highlight}>HealthKit </Text>
                and sends it to your favorite webhook for storage.
              </Text>
              <Text style={{
                paddingTop: "5%",
                paddingBottom: "25%"
              }}>Last Triggered: {
                lastTriggered ?
                  <Text>{lastTriggered.toLocaleString()}</Text> :
                  <Text>Never</Text>
              }</Text>
              <Button onPress={saveData} title="Trigger" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
