import AppleHealthKit from './rn-apple-healthkit';

const getDailyInfo = (func, params) =>
  new Promise((resolve, reject) => {
    AppleHealthKit[func](params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

export const getAlLData = () =>
  new Promise((resolve, reject) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const startDate = new Date(currentDate).toISOString();
    const endDate = new Date().toISOString();
    const result = {};
    const getData = (func, param, name) =>
      new Promise((resolve, reject) => {
        getDailyInfo(
          func,
          typeof param === 'undefined'
            ? {startDate, endDate}
            : {startDate, endDate, ...param},
        )
          .then(data => {
            result[name || func] = data;
            resolve();
          })
          .catch(error => reject(error));
      });
    Promise.resolve()
      .then(() => getData('getBasalEnergyBurned'))
      .catch(() => {})
      .then(() => getData('getActiveEnergyBurned'))
      .catch(() => {})
      .then(() => getData('getBloodGlucoseSamples'))
      .catch(() => {})
      .then(() => getData('getBloodPressureSamples'))
      .catch(() => {})
      .then(() => getData('getBodyTemperatureSamples'))
      .catch(() => {})
      .then(() => getData('getDailyDistanceCyclingSamples'))
      .catch(() => {})
      .then(() => getData('getDailyDistanceWalkingRunningSamples'))
      .catch(() => {})
      .then(() => getData('getDailyFlightsClimbedSamples'))
      .catch(() => {})
      .then(() => getData('getDailyStepCountSamples'))
      .catch(() => {})
      .then(() => getData('getHeartRateSamples'))
      .catch(() => {})
      .then(() => getData('getHeightSamples'))
      .catch(() => {})
      .then(() => getData('getRespiratoryRateSamples'))
      .catch(() => {})
      .then(() => getData('getWeightSamples'))
      .catch(() => {})
      .then(() => getData('getSleepSamples'))
      .catch(() => {})
      .then(() =>
        getData('getSamples', {type: 'Walking'}, 'getSamples_Walking'),
      )
      .catch(() => {})
      .then(() =>
        getData(
          'getSamples',
          {type: 'StairClimbing'},
          'getSamples_StairClimbing',
        ),
      )
      .catch(() => {})
      .then(() =>
        getData('getSamples', {type: 'Running'}, 'getSamples_Running'),
      )
      .catch(() => {})
      .then(() =>
        getData('getSamples', {type: 'Cycling'}, 'getSamples_Cycling'),
      )
      .catch(() => {})
      .then(() => resolve(result))
      .catch(error => reject(error));
  });
