#!/bin/bash

openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout tlsPrivateKey.key -out tlsPublicCertificate.crt
openssl pkcs12 -export -out tlsPrivateKey.pfx -inkey tlsPrivateKey.key -in tlsPublicCertificate.crt
