// js/push-notifications.js

window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(function(OneSignal) {
  OneSignal.init({
    // IMPORTANT: Replace "YOUR_ONESIGNAL_APP_ID" with your actual OneSignal App ID.
    // You can get this from your OneSignal account dashboard.
    appId: "YOUR_ONESIGNAL_APP_ID",
    // The "Typical Site" setup in OneSignal will automatically handle the rest,
    // including the permission prompt.
  });
});
