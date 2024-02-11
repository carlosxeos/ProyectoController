#include <WiFi.h>
#include <PubSubClient.h>
#include <Client.h>
#include <ArduinoJson.h>
#include <Wire.h>
//// 25/07/23

// Replace the next variables with your SSID/Password combination
const char* ssid = "IZZI-3AB1";
const char* password = "509551243AB1";

// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
//const char* mqtt_server = "192.168.0.12";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int pin_led = 2;
DynamicJsonDocument doc(1024);
const String enterpriseId = "1c8ac7aa-de9b-4daf-92f5-dc48d4da89d6";
const byte doorSizeUuid = 2;
const String doorUuid[doorSizeUuid] = {
  "af04b978-e4e7-4cbf-a31f-9ea50c3d6744",  // puerta principal
  "ae70c7a2-7756-43cf-a34c-39bcee021e38"   // interior dtch
};
const int pinDoor[4] = {
  4,  // puerta principal
  16,
  17,
  5
};
const String getDoorKey = "get/door/";
const String setDoorKey = "set/door/";
//const char* const acControllerEndpoint = "get/ac_controllerjiogrejasgiojiowofjirejiofer";
const String MQTT_CLIENT_NAME = "sys-" + enterpriseId;

byte stateled;
void setup() {
  Serial.begin(115200);
  setup_wifi();
  IPAddress ipAddress(13, 68, 134, 198);//ipAddress(192, 168, 1, 10);  // 13.68.134.198
  client.setServer(ipAddress, 1883);
  client.setCallback(callback);
  pinMode(pin_led, OUTPUT);

  pinMode(4,OUTPUT);
  pinMode(16,OUTPUT);
  pinMode(17,OUTPUT);
  pinMode(5,OUTPUT);

  pinMode(15,INPUT);

  //for (int i = 0; i < doorSizeUuid; i++) {
  //  pinMode(pinDoor[i], OUTPUT);
  //}
  pinMode(25, OUTPUT);
  Wire.begin();
}

void setup_wifi() {
  WiFi.mode(WIFI_STA);
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

String messageTemp;
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  // convertir a json
  deserializeJson(doc, messageTemp);
  Serial.println();
  if (strncmp(topic, getDoorKey.c_str(), getDoorKey.length()) == 0) {  // door
    doorTopicHandler(String(topic).substring(getDoorKey.length()));
  }
  // if (strncmp(topic, acControllerEndpoint, 17) == 0) {  // ac Controller
  //   acControllerTopicHandler();
  // }
}

void reconnect() {
  // Loop until we're reconnected
  Serial.println("");
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(MQTT_CLIENT_NAME.c_str(), "espsys", "VWxoT2QwMTZTbFJsV0U1dldrZG9lZz09")) {  // Attempt to connect
      Serial.println("connected");
      // Subscriptions
      // suscribimos todos los portones disponibles
      for (int i = 0; i < doorSizeUuid; i++) {
        client.subscribe(String(getDoorKey + doorUuid[i]).c_str());
      }
      //client.subscribe(acControllerEndpoint);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);  // Wait 5 seconds before retrying
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if(digitalRead(15)==LOW){
        digitalWrite(4,HIGH);
        delay(100);
        digitalWrite(4,LOW);
  }
}

void doorTopicHandler(String uuid) {
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
}

void doorActivationHardware(int i){
        digitalWrite(pinDoor[i],HIGH);
        delay(250);
        digitalWrite(pinDoor[i],LOW);
}