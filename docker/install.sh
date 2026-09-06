#!/bin/bash

#  Copyright (C) 2018-2021 LEIDOS.
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

set -ex

# Configure Docker repository for Debian Bookworm
apt-get update
apt-get install -y ca-certificates curl

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg \
        -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

. /etc/os-release

cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: ${VERSION_CODENAME}
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# Ensure docker group id is 998. CARMA UI is dependent on having the group id be the same between the image and vehicle PC.
if [[ -z $(grep  -i "docker" /etc/group) ]]; then
    	echo "User docker does not exists in /etc/group, creating docker group id of 998"
   	    addgroup --gid 998 docker
else
	echo "User docker already exists in /etc/group."

	if [[ $(grep  -i "docker" /etc/group) == *"docker:x:998"* ]]; then
	    echo "Docker group id is correct"
	else
	    echo "ERROR: CARMA requires the docker group id 998 in the host PC. Please update the Host PC to correct this before trying again."
	    exit
	fi
fi

# Install docker and docker-compose
apt-get update
apt-get -y install docker-ce

curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

# Configure user permissions for docker
usermod -aG docker www-data

# Install stub carma.config.js to be overriden by later configuration
mkdir -p /opt/carma/vehicle/config
touch /opt/carma/vehicle/config/carma.config.js
ln -sf /opt/carma/vehicle/config/carma.config.js /var/www/html/scripts/app/carma.config.js
chown www-data:www-data /opt/carma/vehicle/config/carma.config.js