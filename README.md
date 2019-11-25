![Yoga](/assets/wordmark.svg)

Yoga is an iOS app which finds data from HealthKit and sends it to your webhook for storage and analyics, written in React Native.

For me, it powers [Life Data](https://github.com/AnandChowdhary/life-data) where I store health data like heart rate and daily step count.

## ⭐ Features

- Fetch multiple datapoints from HealthKit
- Send JSON data to any webhook
- Runs in the background, once every day

## Development

**Notes:**

Because of [terrillo/rn-apple-healthkit#125](https://github.com/terrillo/rn-apple-healthkit/issues/125), you have to manually edit a file in `node_modules` before linking.

## 📄 License

- Code: [MIT](https://github.com/AnandChowdhary/yoga/blob/master/LICENSE)
- Icon: CC-BY-3.0 [Graphic Tigers](https://thenounproject.com/Graphic_Tigers)
