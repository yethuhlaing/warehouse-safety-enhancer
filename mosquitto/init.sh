#!/bin/sh
if [ ! -f /mosquitto/config/passwd ]; then
  echo 'Creating Mosquitto password file...'
  chmod 0700 /mosquitto/config/passwd/passwd.txt
  chown mosquitto:mosquitto /mosquitto/config/passwd/passwd.txt
  mosquitto_passwd -b -c /mosquitto/config/passwd/passwd.txt $MOSQUITTO_USERNAME $MOSQUITTO_PASSWORD
  mosquitto -c /mosquitto/config/mosquitto.conf
else
  echo 'Mosquitto password file already exists.'
fi    