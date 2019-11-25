/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppleHealthKit from 'rn-apple-healthkit';
const ENDPOINT = 'https://services.anandchowdhary.now.sh/api/yoga';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {getAlLData} from './healthkit';
const PERMISSIONS = AppleHealthKit.Constants.Permissions;
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

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
          PERMISSIONS.BodyFatPercentage,
        ],
      },
    };
    AppleHealthKit.initHealthKit(options, error => {
      if (error) return reject(error);
      getAlLData()
        .then(data => {
          resolve(data);
        })
        .catch(error => reject(error));
    });
  });
};

const send = (data) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.open("POST", ENDPOINT, true);
  request.addEventListener("load", () =>
    resolve(JSON.parse(request.responseText).url)
  );
  request.addEventListener("error", () => reject("response_not_ok"));
  request.addEventListener("abort", () => reject("upload_aborted"));
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
});

const App: () => React$Node = () => {
  const [lastTriggered, setLastTriggered] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('lastTriggered')
      .then(val => {
        if (val) setLastTriggered(new Date(parseInt(val)));
      })
      .catch(() => {});
  }, []);
  const saveData = () => {
    getHealthData()
      .then(data => send(data))
      .then(() => setLastTriggered(new Date()))
      .then(() =>
        AsyncStorage.setItem('lastTriggered', new Date().getTime().toString()),
      )
      .catch(error => {
        console.log('ERROR', error);
        alert('I got an error in saving this data');
      });
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
                Yoga finds your health data using{' '}
                <Text style={styles.highlight}>HealthKit </Text>
                and sends it to your favorite webhook for storage.
              </Text>
              <Text
                style={{
                  paddingTop: '5%',
                  paddingBottom: '25%',
                }}>
                Last Triggered:{' '}
                {lastTriggered ? (
                  <Text>{timeAgo.format(lastTriggered)}</Text>
                ) : (
                  <Text>Never</Text>
                )}
              </Text>
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
