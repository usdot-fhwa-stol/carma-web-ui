#!/bin/bash

#  Copyright (C) 2018-2020 LEIDOS.
# 
#  Licensed under the Apache License, Version 2.0 (the "License"); you may not
#  use this file except in compliance with the License. You may obtain a copy of
#  the License at
# 
#  http://www.apache.org/licenses/LICENSE-2.0
# 
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#  License for the specific language governing permissions and limitations under
#  the License.

# Script sets up the /opt/carma-messenger folder for the user
# Takes in one argument which is the path to the vehicle installation folder to use

GRP_ID=1000
sudo groupadd --gid $GRP_ID carma # create the carma messenger group if it does not already exist and add current user to it
USERNAME=$(whoami)
sudo usermod -a -G $GRP_ID $USERNAME

sudo mkdir -p /opt/carma/Desktop /opt/carma/Pictures 
sudo chgrp -R $GRP_ID /opt/carma/
sudo chmod 775 -R /opt/carma/
sudo chmod 775 /opt/carma/Desktop /opt/carma/Pictures

curl -o /opt/carma/Desktop/CARMA_WEB_UI.desktop -L https://raw.githubusercontent.com/usdot-fhwa-stol/carma-web-ui/integration/ui_redesign_basic_travel/install_scripts/Desktop/CARMA_WEB_UI.desktop 
chmod 775 /opt/carma/Desktop/CARMA_WEB_UI.desktop


curl -o /opt/carma/Pictures/CARMA_icon_color.png  https://raw.githubusercontent.com/usdot-fhwa-stol/carma-web-ui/integration/ui_redesign_basic_travel/install_scripts/Pictures/CARMA_icon_color.png 
chmod 775 /opt/carma/Pictures/CARMA_icon_color.png

cp /opt/carma/Desktop/CARMA_WEB_UI.desktop ~/Desktop/
chmod 775 ~/Desktop/CARMA_WEB_UI.desktop

