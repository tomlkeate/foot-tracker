#include <BLEDevice.h>
#include "heltec.h"
#include <HardwareSerial.h> // Reference the ESP32 built-in serial port library

#define RXD2 22
#define TXD2 23
HardwareSerial lidarSerial1(1); // Using serial port 1

#define RXD3 17
#define TXD3 16
HardwareSerial lidarSerial2(2); // Using serial port 2


#define DEVICE_NAME         "TOM BLE"
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLECharacteristic *pCharacteristic;
String message = "";

void printToScreen(String s) {
  Heltec.display->clear();
  Heltec.display->drawString(0, 0, s);
  Heltec.display->display();
}

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.print("BLE client connected.");
    };

    void onDisconnect(BLEServer* pServer) {
      Serial.print("BLE client disconnected.");
      BLEDevice::startAdvertising();
    }
};

class MyCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *characteristic) {
    message = String(characteristic->getValue().c_str());
    if (message == "ledoff") {
      digitalWrite(25, LOW);
    }
    if (message == "ledon") {
      digitalWrite(25, HIGH);
    }
  }
};

void setup() {
  Serial.begin(115200);
  lidarSerial1.begin(115200, SERIAL_8N1, RXD2, TXD2); // Initializing serial port
  lidarSerial2.begin(115200, SERIAL_8N1, RXD3, TXD3); // Initializing serial port
  Serial.print("Starting BLE\n");

  BLEDevice::init(DEVICE_NAME);

  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
     CHARACTERISTIC_UUID,
     BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );
  pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
  pCharacteristic->setValue("Init");

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();
}

uint16_t distance1 = 0;
uint16_t targetDistance1 = 0;
uint16_t distance2 = 0;
uint16_t targetDistance2 = 0;
uint16_t strength1 = 0;
uint16_t strength2 = 0;
int16_t temperature1 = 0;
int16_t temperature2 = 0;
int16_t ticksSinceLastUpdate1 = 0;
int16_t ticksSinceLastUpdate2 = 0;
int8_t current = 0;
long timeSinceCurrentUpdate = millis();
long resetCurrentTimeout = 1000;
int16_t people = 0;
uint16_t currentPeople= 0;
bool turn = true;
long timeout = 2000;
long updateCharacteristicTimeout = 2000;
long tC = millis();

void loop() {
  uint8_t buf[9] = {0}; // An array that holds data
  ticksSinceLastUpdate1++;
  ticksSinceLastUpdate2++;
  if (turn) {
    if (lidarSerial1.available() > 0) {
        lidarSerial1.readBytes(buf, 9); // Read 9 bytes of data
        if( buf[0] == 0x59 && buf[1] == 0x59)
        {
          turn = false;
          distance1 = buf[2] + (buf[3] << 8);
          strength1 = buf[4] + (buf[5] << 8);
          temperature1 = buf[6] + (buf[7] << 8);
          if (targetDistance1 == 0) {
            targetDistance1 = distance1;
          } else {
            if (abs(targetDistance1 - distance1) > 30) {
              Serial.print("Serial 1: went of");
              if (current == 2) {
                current = 0;
              } else {
                current = 1;
                if (people > 0) people--;
              }
              long t0 = millis();
              while (abs(targetDistance1 - distance1) > 30) {
                uint8_t tempBuf[9] = {0};
                lidarSerial1.readBytes(tempBuf, 9); // Read 9 bytes of data
                if(tempBuf[0] == 0x59 && tempBuf[1] == 0x59) distance1 = tempBuf[2] + ((tempBuf[3]) << 8);
                if (millis() - t0 > timeout) break;
                else delay(15);
                Serial.print("\nstuck");
              }
              timeSinceCurrentUpdate = millis();
            }
          }
          ticksSinceLastUpdate1 = 0;
        }
    }
  }
  else {
    uint8_t buf2[9] = {0}; // An array that holds data
    if (lidarSerial2.available() > 0) {
        lidarSerial2.readBytes(buf2, 9); // Read 9 bytes of data
        if( buf2[0] == 0x59 && buf2[1] == 0x59)
        {
          turn = true;
          distance2 = buf2[2] + (buf2[3] << 8);
          strength2 = buf2[4] + (buf2[5] << 8);
          temperature2 = buf2[6] + (buf2[7] << 8);
          if (targetDistance2 == 0) {
            targetDistance2 = distance2;
          } else {
            if (abs(targetDistance2 - distance2) > 30) {
              Serial.print("Serial 2: went of");
              if (current == 1) {
                current = 0;
              } else {
                current = 2;
                people++;
              }
              long t0 = millis();
              while (abs(targetDistance2 - distance2) > 30) {
                uint8_t tempBuf[9] = {0};
                lidarSerial2.readBytes(tempBuf, 9); // Read 9 bytes of data
                if(tempBuf[0] == 0x59 && tempBuf[1] == 0x59) distance2 = tempBuf[2] + ((tempBuf[3]) << 8);
                if (millis() - t0 > timeout) break;
                else delay(15);
                Serial.print("\nstuck");
              }
              timeSinceCurrentUpdate = millis();
            }
          }
          ticksSinceLastUpdate2 = 0;
        }
    }
  }
  if ((current != 0) && (millis() - timeSinceCurrentUpdate > resetCurrentTimeout)) {
    current = 0;
    timeSinceCurrentUpdate = millis();
  }
  if (millis() - tC > updateCharacteristicTimeout || people != currentPeople) {
    currentPeople = people;
    Serial.print("\nPeople: ");
    Serial.print(people);
    pCharacteristic->setValue((
          String("{\"Serial 1\":{") +
          String("\"Ticks since last update\":") + String(ticksSinceLastUpdate1) +
          String(",\"Target distance\":") + String(targetDistance1) +
          String(",\"Distance\":") + String(distance1) + 
          String(",\"Strength\":") + String(strength1) + 
          String(",\"Temperature\":") + String(temperature1 / 8.0 - 256.0) +
          String("},\"Serial 2\":{") + 
          String("\"Ticks since last update\":") + String(ticksSinceLastUpdate2) +
          String(",\"Target distance\":") + String(targetDistance2) + 
          String(",\"Distance\":") + String(distance2) + 
          String(",\"Strength\":") + String(strength2) +
          String(",\"Temperature\":") + String(temperature2 / 8.0 - 256.0) +
          String("},\"People\":") + String(people) + String("}")
    ).c_str());
    pCharacteristic->notify();
    tC = millis();
  } 
  else {
    delay(13);
  }
}

// Serial.print("Serial 2 ");
// Serial.print("Ticks since last update: ");
// Serial.print(ticksSinceLastUpdate2);
// Serial.print(" Target Distance: ");
// Serial.print(targetDistance2);
// Serial.print(" Distance: ");
// Serial.print(distance2);
// Serial.print(" cm, strength: ");
// Serial.print(strength2);
// Serial.print(", temperature: ");
// Serial.println(temperature2 / 8.0 - 256.0);
