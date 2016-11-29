Installing Geosupport + nyc-batch-geocoder
====================================

# Background
These are the installation instructions for getting [Geosupport](http://www1.nyc.gov/site/planning/data-maps/open-data/dwn-gde-home.page) + nyc-batch-geocoder to work on a bog-standard Ubuntu 16.04 (LTS).

The underlying code for Geosupport is **not open source**, but rather a packaged binary for Linux. I presume it is compiled for an x86_64, processor, though this hasn't been confirmed. It will not run on an ARM system (e.g. Raspberry Pi), nor any other processor architecture. If running this on a Raspberry Pi is something you're interested in, bug Colin Reilly, the Senior Director for GIS at NYC DOITT, [on Twitter](https://twitter.com/ColinReillyNY). (Thank you Colin!)

These instructions should be effectively identical to those implemented in this repository's [Dockerfile](Dockerfile) and these instructions should update to reflect changes made there. Feel free to [yell at me in the Github Issues](https://github.com/riordan/crazy-fast-nyc-batch-geocoder/issues) should that not be the case or the instructions break.

These installation instruction are derived from:
* [Noah Veltman's](https://github.com/veltman) original [Geocoding 10,000 addresses a second with NYC's Geosupport library and Node FFI](https://gist.github.com/veltman/2c79458b2226466920dbd601bf94551f)

# Instructions
## First Steps

Update system & install unzip, curl, nodejs, and npm (if necessary)
```bash
sudo apt-get update --yes
sudo apt-get upgrade --yes
sudo apt-get install --yes unzip, curl, nodejs, npm
```

Default installation of Nodejs on Ubuntu has an [issue with clashing programs named node](http://stackoverflow.com/questions/18130164/nodejs-vs-node-on-ubuntu-12-04#18130296), so you'll have to do this extra step to make sure it responds to `node`, not just `nodejs`.
```bash
sudo ln -s `which nodejs` /usr/bin/node
```

## installing nyc-batch-geocoder node package
_Note: Installation of `nyc-batch-geocoder` node package and Geosupport library are performed in the opposite order in the Dockerfile. This should have no discernable effect on the outcome._

Download / clone / obtain the codebase
```bash
curl -LOk "https://github.com/riordan/nyc-batch-geocoder/archive/master.zip"
unzip master.zip
mv nyc-batch-geocoder-master nyc-batch-geocoder
rm master.zip
cd nyc-batch-geocoder
```

Install node dependencies:
```bash
npm install
```

## Install Geosupport
Download Geosupport and unzip archive into folder
```bash
curl -LOk "http://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/gdelx_16d.zip"
unzip gdelx_16d.zip
rm gdelx_16d.zip # Delete the zip file; you don't need it any more
```

**NOTE:** _At time of writing (November 28, 2016), the latest version of Geosupport is: [16d](http://www1.nyc.gov/site/planning/data-maps/open-data/dwn-gde-home.page). This was released some time after August, 2016, as indicated by the release date of version 16C on the [Geosupport Archive Page](http://www1.nyc.gov/site/planning/data-maps/open-data/geosupport-archive.page). I will attempt to keep this URL as up to date as possible with future releases, but cannot make any guarantees._

Set environment variables:
```bash
export LD_LIBRARY_PATH="$(pwd)/version-16d_16.4/lib/"
export GEOFILES="$(pwd)/version-16d_16.4/fls/"
export GEOSUPPORT_LIBGEO="$(pwd)/version-16d_16.4/lib/libgeo.so"
```

_If you want this to persist across reboots, you'll want to add these to your .profile (usually a `.bash_profile`). This is done with something like:_

```bash
echo 'export LD_LIBRARY_PATH=$(pwd)/version-16d_16.4/lib/' >>~/.bash_profile
echo 'export GEOFILES=$(pwd)/version-16d_16.4/fls/' >>~/.bash_profile
echo 'export GEOSUPPORT_LIBGEO=$(pwd)/version-16d_16.4/lib/libgeo.so' >>~/.bash_profile
source ~/.bash_profile
```

Rejoice at the installation of Geosupport.

Run a test of the application from the `nyc-batch-geocoder/` directory:
```bash
node index.js
```
