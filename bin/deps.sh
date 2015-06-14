#!/bin/sh
echo "Downloading BrowserMob Proxy"
mkdir -p ./deps
cd deps

wget -q -O bmp.zip https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.0-beta-1/browsermob-proxy-2.1.0-beta-1-bin.zip

unzip bmp.zip
rm bmp.zip
mv browsermob-proxy-2.1.0-beta-1 bmp

echo "Downloading Selenium"

wget -q --progress=bar -O selenium.jar  http://selenium-release.storage.googleapis.com/2.46/selenium-server-standalone-2.46.0.jar

