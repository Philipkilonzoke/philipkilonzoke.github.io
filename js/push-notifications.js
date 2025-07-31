// js/push-notifications.js

window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "e5df4d1e-82bb-46da-93e6-d262531b5e1e",
  });
});
