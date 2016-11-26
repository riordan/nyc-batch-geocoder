FROM ubuntu:14.04
MAINTAINER David Riordan  <dr@daveriordan.com>
# Update, install Node and unzip (if needed)
RUN sudo apt-get update --yes && \
    sudo apt-get upgrade --yes && \
    sudo apt-get install --yes unzip nodejs npm wget

# Fix legacy node naming nonsense on Ubuntu (if needed)
RUN sudo ln -s `which nodejs` /usr/bin/node

WORKDIR  /geocoding
# Download Geosupport Desktop for Linux
RUN wget http://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/gdelx_16c.zip && \
    unzip gdelx_16c.zip && \
    rm gdelx_16c.zip

# Set env variables to the full paths to lib/ and fls/
ENV LD_LIBRARY_PATH="/geocoding/version-16c_16.3/lib/"
ENV GEOFILES="/geocoding/version-16c_16.3/fls/"


ADD geocode.js /geocoding/geocode.js
ADD geosupport.js /geocoding/geosupport.js
ADD package.json /geocoding/package.json
RUN npm install

CMD ["node", "geocode.js"]
