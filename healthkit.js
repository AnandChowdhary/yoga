import AppleHealthKit from 'rn-apple-healthkit';

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
      .catc(() => {})
      .then(() => getData('getActiveEnergyBurned'))
      .catc(() => {})
      .then(() => getData('getBloodGlucoseSamples'))
      .catc(() => {})
      .then(() => getData('getBloodPressureSamples'))
      .catc(() => {})
      .then(() => getData('getBodyTemperatureSamples'))
      .catc(() => {})
      .then(() => getData('getDailyDistanceCyclingSamples'))
      .catc(() => {})
      .then(() => getData('getDailyDistanceWalkingRunningSamples'))
      .catc(() => {})
      .then(() => getData('getDailyFlightsClimbedSamples'))
      .catc(() => {})
      .then(() => getData('getDailyStepCountSamples'))
      .catc(() => {})
      .then(() => getData('getHeartRateSamples'))
      .catc(() => {})
      .then(() => getData('getHeightSamples'))
      .catc(() => {})
      .then(() => getData('getRespiratoryRateSamples'))
      .catc(() => {})
      .then(() => getData('getWeightSamples'))
      .catc(() => {})
      .then(() => getData('getSleepSamples'))
      .catc(() => {})
      .then(() =>
        getData('getSamples', {type: 'Walking'}, 'getSamples_Walking'),
      )
      .catc(() => {})
      .then(() =>
        getData(
          'getSamples',
          {type: 'StairClimbing'},
          'getSamples_StairClimbing',
        ),
      )
      .catc(() => {})
      .then(() =>
        getData('getSamples', {type: 'Running'}, 'getSamples_Running'),
      )
      .catc(() => {})
      .then(() =>
        getData('getSamples', {type: 'Cycling'}, 'getSamples_Cycling'),
      )
      .catc(() => {})
      .then(() => resolve(result))
      .catch(error => reject(error));
  });
