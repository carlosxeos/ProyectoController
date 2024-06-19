#include <WiFi.h>
#include <PubSubClient.h>
#include <Client.h>
#include <ArduinoJson.h>
#include <Wire.h>
//// 25/07/23

// Replace the next variables with your SSID/Password combination
//const char* ssid =  //"INFI-NITUM620F_2.4";
//  "IZZI-C79C";
//const char* password =  //"1585973336";
//  "DAEU9eHv";
const byte arrayNetworkSize = 2;
const char* ssidArray[] = {
  "IZZI-C79C",
  "OtraRed"
};

const char* passwordArray[] = {
  "DAEU9eHv",
  "Juarez"
};
// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
//const char* mqtt_server = "192.168.0.12";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int pin_led = 2;
//DynamicJsonDocument doc(1024);
const String enterpriseId = "1c8ac7aa-de9b-4daf-92f5-dc48d4da89d6";
const byte doorSizeUuid = 2;
const String doorUuid[doorSizeUuid] = {
  "af04b978-e4e7-4cbf-a31f-9ea50c3d6744",  // puerta principal
  "ae70c7a2-7756-43cf-a34c-39bcee021e38"   // interior dtch
};
const int pinDoor[4] = {
  4,   // puerta principal
  16,  // interior dtch
  17,
  5
};
const String getDoorKey = "get/door/";
const String setDoorKey = "set/door/";
const char* const LOG_DOOR = "logs/doors";
const char* const INIT_SYS_KEY = "logs/initsyst";

//const char* const acControllerEndpoint = "get/ac_controllerjiogrejasgiojiowofjirejiofer";
const String MQTT_CLIENT_NAME = "sys-" + enterpriseId;

byte stateled;
byte selectedNetworkIndex = 0;
void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  delay(10);
  setup_wifi();
  IPAddress  //ipAddress(13, 68, 134, 198);
    ipAddress(192, 168, 1, 10);
  // 13.68.134.198
  client.setServer(ipAddress, 1883);
  client.setCallback(callback);
  pinMode(pin_led, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(16, OUTPUT);
  pinMode(17, OUTPUT);
  pinMode(5, OUTPUT);

  pinMode(15, INPUT);

  //for (int i = 0; i < doorSizeUuid; i++) {
  //  pinMode(pinDoor[i], OUTPUT);
  //}
  pinMode(25, OUTPUT);
  Wire.begin();
}

void setup_wifi() {
  selectedNetworkIndex = -1;
  // We start by connecting to a WiFi network
  byte count;
  for (byte i = 0; i < arrayNetworkSize; i++) {
    count = 0;
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssidArray[i]);
    WiFi.begin(ssidArray[i], passwordArray[i]);
    while (WiFi.status() != WL_CONNECTED && count < 120) {  // esperamos unos 60 seg a ver si conecta
      delay(500);
      Serial.print(".");
      count++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("");
      Serial.println("WiFi connected");
      Serial.println("IP address: ");
      Serial.println(WiFi.localIP());
      selectedNetworkIndex = i;
      break;
    }
  }
  if (selectedNetworkIndex == -1) {
    Serial.println("No hay conexion");
  }
}

String messageTemp = "";
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  StaticJsonDocument<256> doc;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }
  Serial.print(messageTemp);
  // convertir a json
  deserializeJson(doc, messageTemp);
  Serial.println();
  if (strncmp(topic, getDoorKey.c_str(), getDoorKey.length()) == 0) {  // door
    doorTopicHandler(doc, String(topic).substring(getDoorKey.length()));
  }
  // if (strncmp(topic, acControllerEndpoint, 17) == 0) {  // ac Controller
  //   acControllerTopicHandler();
  // }
  doc.clear();
  messageTemp = "";
}

void reconnect() {
  // Loop until we're reconnected
  Serial.println("");
  Serial.print("Attempting MQTT connection...");
  if (client.connect(MQTT_CLIENT_NAME.c_str(), "espsys", "VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09")) {  // Attempt to connect
    Serial.println("connected");
    // Subscriptions
    // suscribimos todos los portones disponibles
    for (int i = 0; i < doorSizeUuid; i++) {
      client.subscribe(String(getDoorKey + doorUuid[i]).c_str());
    }
    //client.subscribe(acControllerEndpoint);
    client.publish(INIT_SYS_KEY, (
                                   String(selectedNetworkIndex >= 0 && selectedNetworkIndex < arrayNetworkSize ? ssidArray[selectedNetworkIndex] : "redNARev")
                                   + "+" + MQTT_CLIENT_NAME)
                                   .c_str());
  } else {
    Serial.print("failed, rc=");
    Serial.print(client.state());
    Serial.println(" try again in 5 seconds");
    delay(5000);  // Wait 5 seconds before retrying
  }
}
void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {
    if (!client.connected()) {
      reconnect();
    }
    if (client.connected()) {
      client.loop();
      if (digitalRead(15) == LOW) {
        digitalWrite(4, HIGH);
        delay(100);
        digitalWrite(4, LOW);
      }
    }
  } else {  // si no tiene conexion a wifi, intenta conectar a un modem
    setup_wifi();
    if (WiFi.status() != WL_CONNECTED) {
      delay(30000); // esperamos 30 segundos como tolerancia para volver a intentar conexion
    }
  }
}

String msgSenderClient;
void doorTopicHandler(StaticJsonDocument<256>& doc, String uuid) {
  Serial.print("UUID ");
  Serial.println(uuid);
  if (doc["data"]["type"].isNull() || doc["data"]["idUsuario"].isNull()) {
    // sin esta info no podemos ejecutar
    return;
  }
  for (int i = 0; i < doorSizeUuid; i++) {
    if (doorUuid[i].equals(uuid)) {  // encuentra que porton es, por ahora va a hacer lo mismo para todos los portones
                                     //if (doc["data"]["type"] == "1") {
      // aqui se va a hacer la logica correspondiente al sistema
      doorActivationHardware(i);
      Serial.print("type: ");
      String text = doc["data"]["type"].as<String>();
      Serial.println(text);
      if (doc["data"]["type"] == "1") {
        msgSenderClient = "Opening door ";
      } else {
        msgSenderClient = "Closing door ";
      }
      msgSenderClient += uuid;
      Serial.print("Msg: ");
      Serial.println(msgSenderClient);
      client.publish(LOG_DOOR, msgSenderClient.c_str());
      msgSenderClient = "";
      /*
      if (i == 0) {
        Serial.println("Abriendo puerta 1");
        doorActivationHardware();
      }
      if (i == 1) {
        Serial.println("Abriendo puerta 2");

        digitalWrite(4,HIGH);
        delay(100);
        digitalWrite(4,LOW);

      }
*/
      //client.publish(String(setDoorKey + uuid).c_str(), messageTemp.c_str());
      // client.publish()
      // } else if (doc["data"]["type"] == "0") {
      //   Serial.println("Aqui cerraria el porton");
      // }
    }
  }
}

/*
void acControllerTopicHandler() {
  if (!(doc["data"].isNull()) && doc["data"].containsKey("id") && doc["data"].containsKey("text")) {
    int id = doc["data"]["id"];
    String text = doc["data"]["text"];
    Serial.print("Case ");
    Serial.println(id);
    switch (id) {
      case 1:
        if (text.equals("off")) {
          Serial.println("apagando el clima");
        }
        if (text.equals("on")) {
          Serial.println("Encendiendo el clima");
        }
        break;
      case 2:
        Serial.printf("Subiendo la temperatura a %s", text);
        Serial.println();
        break;
      case 3:
        Serial.printf("Bajando la temperatura a %s", text);
        Serial.println();
        break;
    }
  } else {
    Serial.println("Datos no encontrados");
  }
}*/

void doorActivationHardware(int i) {
  digitalWrite(pinDoor[i], HIGH);
  delay(350);
  digitalWrite(pinDoor[i], LOW);
}