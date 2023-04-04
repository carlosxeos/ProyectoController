#include <WiFi.h>
#include <PubSubClient.h>
#include <Client.h>
#include <ArduinoJson.h>

// Replace the next variables with your SSID/Password combination
const char* ssid = "IzziWiFiN";
const char* password = "JvnS9L3BAZY9";

// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
const char* mqtt_server = "192.168.0.10";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int pin_led = 23;
DynamicJsonDocument doc(1024);
const char* const doorEndpoint = "get/door";
const char* const acControllerEndpoint = "get/ac_controller";
void setup() {
  Serial.begin(115200);
  setup_wifi();
  IPAddress ipAddress(192, 168, 0, 18);
  client.setServer(ipAddress, 1883);
  client.setCallback(callback);
  pinMode(pin_led, OUTPUT);
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

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  // convertir a json
  deserializeJson(doc, messageTemp);
  Serial.println();
  if (strncmp(topic, doorEndpoint, 8) == 0) {  // door
    doorTopicHandler();
  }
  if (strncmp(topic, acControllerEndpoint, 17) == 0) {  // ac Controller
    acControllerTopicHandler();
  }
}

void reconnect() {
  // Loop until we're reconnected
  Serial.println("");
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("MQTT_SERVICE")) {  // Attempt to connect
      Serial.println("connected");
      // Subscriptions
      client.subscribe(doorEndpoint);
      client.subscribe(acControllerEndpoint);
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
}

void doorTopicHandler() {
  if (doc["data"] == "open") {
    digitalWrite(pin_led, HIGH);
  }
  if (doc["data"] == "close") {
    digitalWrite(pin_led, LOW);
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