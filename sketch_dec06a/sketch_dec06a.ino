/*  
 *  GPRS+GPS Quadband Module (SIM908) 
 *  You should have received a copy of the GNU General Public License 
 *  along with this program.  If not, see http://www.gnu.org/licenses/. 
 *  
 *  Version:           2.0
 *  Design:            Sangeeth Perera
 *  Implementation:    Sangeeeth perera
 */

#include <stdlib.h>
#include <stdio.h>
#include <math.h>

int8_t answer;
int onAlarmPin = 12;
int resetPin = 8;

char data[100];
int data_size;

char aux_str[100];
char aux;
int x = 0;
int gpsSecondCounter=0;
int httpSecondCounter=0;

char N_S,W_E;
char url[] = "http://emebedintime.comxa.com/tryrealtime.php";
char frame[200];

char pin[]="0000";
char apn[]="mobitel3g";
char user_name[]="";
char password[]="";

char latitude[15];
char longitude[15];
char altitude[6];
char date[16];
char time[7];
char satellites[3];
char speedOTG[10];
char course[10];

char temperatureC[10];
char  distance[10];

//#define trigPin 13
//#define echoPin 12

//int sensorPin = 0;

 

void setup(){

    pinMode(onAlarmPin, OUTPUT);
    Serial.begin(115200);  
   
//    pinMode(trigPin, OUTPUT);
//    pinMode(echoPin, INPUT);

    
    power_on();

    delay(3000);

    //sets the PIN code
    snprintf(aux_str, sizeof(aux_str), "AT+CPIN=%s", pin);
    sendATcommand(aux_str, "OK", 2000);
    sendATcommand("AT+GSMBUSY=1", "OK" ,2000);
    
    delay(3000);
    //lookingForAlarm();
    // starts the GPS and waits for signal
    int gpsState = 0;
    while ( start_GPS() == 0){
      if(gpsState>2){
        //restartSim();
        //restartArduino();
      }
      gpsState ++;
    }
    while (sendATcommand("AT+CREG=1", "OK", 2000) == 0);
    
    sendATcommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\"", "OK", 2000);
    snprintf(aux_str, sizeof(aux_str), "AT+SAPBR=3,1,\"APN\",\"%s\"", apn);
    sendATcommand(aux_str, "OK", 2000);
    
    snprintf(aux_str, sizeof(aux_str), "AT+SAPBR=3,1,\"USER\",\"%s\"", user_name);
    sendATcommand(aux_str, "OK", 2000);
    
    snprintf(aux_str, sizeof(aux_str), "AT+SAPBR=3,1,\"PWD\",\"%s\"", password);
    sendATcommand(aux_str, "OK", 2000);
    int state = 0;
    while (sendATcommand("AT+SAPBR=1,1", "OK", 20000) == 0)
    {
        delay(5000);
        if(state > 1){
              //lookingForAlarm();
              //restartSim();
              //restartArduino();
              
        }
        state ++;
    }

}

void loop(){
      get_GPS();
    send_HTTP();

    delay(7000);
    //lookingForAlarm();

}

//void getDistance(){
//   long duration , distance2;
//    digitalWrite(trigPin, LOW);  // Added this line
//  delayMicroseconds(2); // Added this line
//  digitalWrite(trigPin, HIGH);
//
//  duration = pulseIn(echoPin, HIGH);
//  distance2 = (duration/2) / 29.1;
//
//  sprintf(distance,"%lf", distance2);
//  printf("%s\n", distance);
//
//
//  //memcpy(&distance,&distance2 ,10);
//  //snprintf(distance, 10, "%f", distance2);
// String(distance2,DEC).toCharArray(distance,10);
//  delay(1000);
//
//  //return distance;
//
//}

//void getTemp(){
//   //getting the voltage reading from the temperature sensor
// int reading = analogRead(sensorPin);  
// 
// // converting that reading to voltage, for 3.3v arduino use 3.3
// float voltage = reading * 5.0;
// voltage /= 1024.0; 
// 
//
// 
// // now print out the temperature
// float temperatureC2 = (voltage - 0.5) * 7 ;  //converting from 10 mv per degree wit 500 mV offset
//                                               //to degrees ((voltage - 500mV) times 100)
//
////return temperatureC;
////memcpy(&temperatureC, &temperatureC2,12); 
//String(temperatureC2, DEC).toCharArray(temperatureC,10);
////snprintf(temperatureC, 50, "%f", temperatureC2);
////sprintf(temperatureC,"%f", temperatureC2);
////printf("%s\n", temperatureC);
//delay(1000);
//}

void restartArduino(){
    asm volatile ("jmp 0"); 
}
void restartSim(){
  digitalWrite(13,LOW);
  uint8_t answer = 0;
  int state = 0;
  while(sendATcommand("AT+CPOWD=1","NORMAL POWER DOWN", 2000)==0){
    if(state >3)
      break;
      state++;
  }
  delay(7000);
  powerOnSim();
}
void powerOnSim(){
  analogWrite(6, analogRead(A1));
  delay(3000);
  power_on();
  analogWrite(6, 0);
}
void power_on(){
    uint8_t answer=0;
    // checks if the module is started
    answer = sendATcommand("AT", "OK", 2000);
    if (answer == 0)
    {
        

        int state = 0;
        while(answer == 0){  
           answer = sendATcommand("AT", "OK", 2000);
            if(state>3){
              lookingForAlarm();
              restartSim();
              restartArduino();
            }
            state += 1;    
        }
    }
  sendATcommand("AT+IPR=0", "OK" ,2000);
}

int8_t start_GPS(){

    unsigned long previous;

    previous = millis();
    // starts the GPS
    sendATcommand("AT+CGPSPWR=1", "OK", 2000);
    sendATcommand("AT+CGPSRST=0", "OK", 2000);

    // waits for fix GPS 
    while(( ( sendATcommand("AT+CGPSSTATUS?", "2D Fix", 5000) ||
        sendATcommand("AT+CGPSSTATUS?", "3D Fix", 5000)) == 0 ) && 
        ((millis() - previous) < 90000)){
         // lookingForAlarm(); 
        }

    if ((millis() - previous) < 90000)
    {
        return 1;
    }
    else
    {
        return 0;    
    }
}

int8_t get_GPS(){
    
    int8_t counter, answer;
    long previous;
    while( Serial.available() > 0) Serial.read(); 
    sendATcommand("AT+CGPSINF=0", "AT+CGPSINF=0\r\n\r\n", 2000);

    counter = 0;
    answer = 0;
    memset(frame, '\0', 100);    // Initialize the string
    previous = millis();
    // this loop waits for the NMEA string
    do{

        if(Serial.available() != 0){    
            frame[counter] = Serial.read();
            counter++;
            // check if the desired answer is in the response of the module
            if (strstr(frame, "OK") != NULL)    
            {
                answer = 1;
            }
        }
    }
    while((answer == 0) && ((millis() - previous) < 2000));  

    frame[counter-3] = '\0'; 
    
    // Parses the string 
    Serial.print("fame is : ");
    Serial.println(frame);
    strtok(frame, ",");
    strcpy(longitude,strtok(NULL, ",")); // Gets longitude
    strcpy(latitude,strtok(NULL, ",")); // Gets latitude
    strcpy(altitude,strtok(NULL, ".")); // Gets altitude 
    strtok(NULL, ",");    
    strcpy(date,strtok(NULL, ".")); // Gets date
    strtok(NULL, ",");
    strtok(NULL, ",");  
    strcpy(satellites,strtok(NULL, ",")); // Gets satellites
    strcpy(speedOTG,strtok(NULL, ",")); // Gets speed over ground. Unit is knots.
    strcpy(course,strtok(NULL, "\r")); // Gets course

    if(answer==0){
          if(gpsSecondCounter>3){
            //restartSim();
            //restartArduino();
          }
          gpsSecondCounter++;
        }
    return answer;
}



void send_HTTP(){
    answer = sendATcommand("AT+HTTPINIT", "OK", 10000);
    if (answer == 1)
    {
        answer = sendATcommand("AT+HTTPPARA=\"CID\",1", "OK", 5000);
        if (answer == 1)
        {
            sprintf(aux_str, "AT+HTTPPARA=\"URL\",\"%s", url);
            Serial.print(aux_str);
//            getDistance();
            delay(100);
//            getTemp();
            delay(100);
            sprintf(frame, "?visor=false&latitude=%s&longitude=%s&time=%s&speedOTG=%s&distance=%s&temp=%s&userId=gps_0000001",
            latitude, longitude, date, speedOTG, distance, temperatureC);
            Serial.print(frame);
            answer = sendATcommand("\"", "OK", 5000);
            if (answer == 1)
            {
                answer = sendATcommand("AT+HTTPACTION=0", "+HTTPACTION:0,200", 30000);
                if (answer == 1)
                {

                    Serial.println(F("Done!"));
                }
                else
                {
                    
                      if(httpSecondCounter>3){
                        restartSim();
                        restartArduino();
                      }
                      httpSecondCounter++;
        
                }

            }
            else
            {
                       if(httpSecondCounter>3){
                        restartSim();
                        restartArduino();
                      }
                      httpSecondCounter++;
            }
        }
        else
        {
                      if(httpSecondCounter>3){
                        restartSim();
                        restartArduino();
                      }
                      httpSecondCounter++;
        }    
    }
    else
    {
                       if(httpSecondCounter>3){
                        restartSim();
                        restartArduino();
                      }
                      httpSecondCounter++;
    }

    sendATcommand("AT+HTTPTERM", "OK", 5000);
}
void lookingForAlarm(){
  answer=sendATcommand("AT+CMGL=\"REC UNREAD\",1","788389189",2000);
  Serial.print(answer);
  if(answer==1){
    int ans = 0;
    ans=sendATcommand("AT+CMGL=\"REC UNREAD\",0","vehicle",2000);
    if(ans==1){
      digitalWrite(onAlarmPin, HIGH);
      delay(3000);
      digitalWrite(onAlarmPin, HIGH);
    }
     else{
      digitalWrite(onAlarmPin, LOW);
      delay(3000);
      digitalWrite(onAlarmPin, LOW);
      answer=sendATcommand("AT+CMGD=1,4","OK",2000);
      if(answer == 1)
        Serial.println("All sms were deleted");
     }
  }else{
    sendATcommand("AT+CMGR=1,0","OK",2000);
    sendATcommand("AT+CMGD=1,3","OK",2000);
  
  }
}

int8_t sendATcommand(char* ATcommand, char* expected_answer1, unsigned int timeout){

    uint8_t x=0,  answer=0;
    char response[150];
    unsigned long previous;

    memset(response, '\0', 100);

    delay(100);

    while( Serial.available() > 0) Serial.read();    
    Serial.println(ATcommand);  


        x = 0;
    previous = millis();
    do{
        if(Serial.available() != 0 && x<150){    // 
            response[x] = Serial.read();
            x++;
            if (strstr(response, expected_answer1) != NULL)    
            {
              answer = 1;
            }
            
            
        }
    }
    while((answer == 0) && ((millis() - previous) < timeout));    

    return answer;
}
