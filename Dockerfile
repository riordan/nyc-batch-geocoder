FROM ubuntu:14.04
MAINTAINER David Riordan  <dr@daveriordan.com>
# Update, install Node and unzip (if needed)
RUN sudo apt-get update --yes && \
    sudo apt-get upgrade --yes && \
    sudo apt-get install --yes unzip nodejs npm wget

# Fix legacy node naming nonsense on Ubuntu (if needed)
RUN sudo ln -s `which nodejs` /usr/bin/node

WORKDIR  /geocoding/geosupport
# Download Geosupport Desktop for Linux
RUN wget http://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/gdelx_16c.zip && \
    unzip gdelx_16c.zip
RUN rm gdelx_16c.zip

# Set env variables to the full paths to lib/ and fls/
ENV LD_LIBRARY_PATH="/geocoding/geosupport/version-16c_16.3/lib/"
ENV GEOFILES="/geocoding/geosupport/version-16c_16.3/fls/"


WORKDIR /geocoding
ADD . /geocoding/
RUN npm install

CMD ["node", "geocode.js"]
