FROM node:6.9.1
MAINTAINER David Riordan  <dr@daveriordan.com>
# Update, install Node and unzip (if needed)
RUN apt-get update --yes && \
    apt-get upgrade --yes && \
    apt-get install --yes unzip

WORKDIR  /geocoding/geosupport
# Download Geosupport Desktop for Linux
RUN curl -O http://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/gdelx_16c.zip && \
    unzip gdelx_16c.zip
RUN rm gdelx_16c.zip

# Set env variables to the full paths to lib/ and fls/
ENV LD_LIBRARY_PATH="/geocoding/geosupport/version-16c_16.3/lib/"
ENV GEOFILES="/geocoding/geosupport/version-16c_16.3/fls/"
#For within Node:  var lib = ffi.Library(...)
ENV GEOSUPPORT_LIBGEO="/geocoding/geosupport/version-16c_16.3/lib/libgeo.so"


WORKDIR /geocoding
ADD . /geocoding/
RUN npm install

CMD ["node", "geocode.js"]
