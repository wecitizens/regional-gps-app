#!/usr/bin/env bash

rsync -azP dist/* ubuntu@ec2-52-47-66-164.eu-west-3.compute.amazonaws.com:/home/user/demo/gps/dist/

# Force to put correct access right on dist
ssh -i ".ssh/wecitizens.pem" ubuntu@ec2-52-47-66-164.eu-west-3.compute.amazonaws.com 'sudo chmod -R 777 /home/user/demo/gps/dist/'