import AppleHealthKit from 'rn-apple-healthkit';

const getDailyInfo = (func, params) =>
  new Promise((resolve, reject) => {
    AppleHealthKit[func](params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

export const getAlLData = () => new Promise((resolve, reject) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const startDate = now.toISOString();
  const endDate = (new Date()).toISOString();
  const result = {};
  const getData = (func, param, name) => new Promise((resolve, reject) => {
    getDailyInfo(
      func,
      typeof param === "undefined" ?
        { startDate, endDate } :
        { startDate, endDate, ...param }
    )
    .then(data => {
      result[name || func] = data;
      resolve();
    })
    .catch(error => reject(error));
  });
  Promise.resolve()
    .then(() => getData("getBasalEnergyBurned"))
    .then(() => getData("getActiveEnergyBurned"))
    .then(() => getData("getBloodGlucoseSamples"))
    .then(() => getData("getBloodPressureSamples"))
    .then(() => getData("getBodyTemperatureSamples"))
    .then(() => getData("getDailyDistanceCyclingSamples"))
    .then(() => getData("getDailyDistanceWalkingRunningSamples"))
    .then(() => getData("getDailyFlightsClimbedSamples"))
    .then(() => getData("getDailyStepCountSamples"))
    .then(() => getData("getHeartRateSamples"))
    .then(() => getData("getHeightSamples"))
    .then(() => getData("getRespiratoryRateSamples"))
    .then(() => getData("getWeightSamples"))
    .then(() => getData("getSamples", { type: "Walking" }, "getSamples_Walking"))
    .then(() => getData("getSamples", { type: "StairClimbing" }, "getSamples_StairClimbing"))
    .then(() => getData("getSamples", { type: "Running" }, "getSamples_Running"))
    .then(() => getData("getSamples", { type: "Cycling" }, "getSamples_Cycling"))
    .then(() => resolve(result))
    .catch(error => reject(error));
});