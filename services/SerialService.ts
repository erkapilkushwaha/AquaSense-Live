import { DeviceEventEmitter, NativeModules } from 'react-native';
import { UsbSerialportForAndroid } from 'react-native-usb-serialport-host';

export const SerialService = {
  // 1. Connection Start Karna (Arduino ke liye 9600 Baud Rate)
  startConnection: async (onDataReceived: (data: string) => void) => {
    try {
      // Step 1: Connected USB Devices ki list check karein
      const devices = await UsbSerialportForAndroid.list();
      
      if (devices.length === 0) {
        console.log("No USB Devices found. Connect your Arduino via OTG.");
        return false;
      }

      // Step 2: Pehla device (Arduino) select karein aur permission maangein
      const deviceId = devices[0].deviceId;
      const hasPermission = await UsbSerialportForAndroid.hasPermission(deviceId);
      
      if (!hasPermission) {
        await UsbSerialportForAndroid.requestPermission(deviceId);
      }

      // Step 3: Port Open Karein (9600 Baud Rate standard hai)
      // Note: Data bits (8), Stop bits (1), Parity (None) default hote hain
      await UsbSerialportForAndroid.open(deviceId, 9600);

      console.log("USB Serial Connected Successfully!");

      // Step 4: Serial Listener lagayein jo hardware se aane wale data ko catch karega
      const subscription = DeviceEventEmitter.addListener('onReadDataFromPort', (event) => {
        // Event mein 'data' field hoti hai jo string ya bytes mein hoti hai
        if (event && event.data) {
          // Aapka data TDS|PH|TEMP|TURB format mein yahan aayega
          onDataReceived(event.data);
        }
      });

      return subscription;
    } catch (err) {
      console.error("USB Error: ", err);
      return null;
    }
  },

  // 2. Connection Band Karna (Cleanup)
  stopConnection: async () => {
    try {
      // Saare open ports band karein aur listeners hatayein
      DeviceEventEmitter.removeAllListeners('onReadDataFromPort');
      console.log("Serial Connection Closed.");
    } catch (err) {
      console.error("Error closing serial: ", err);
    }
  }
};
