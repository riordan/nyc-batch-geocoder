Geocode CSVs of NYC! Really Fast!
======================

Based on Noah [@Veltman's](https://github.com/veltman) [Geosupport w/ JS and node-ffi](https://gist.github.com/veltman/2c79458b2226466920dbd601bf94551f), itself based on brilliant work by [Chris Whong](https://gist.github.com/chriswhong/2e5f0f41fc5d366ec902613251445b30).

# Usage
```
Usage: node src/index.js [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -i, --input [source]  REQ: Input source. Takes file location or stream with '-i -'
  -o --output [dest]    OPTIONAL: Output destination. Defaults to stream. Takes file location or stream with '-o -'
```
Takes as input a CSV with the following columns: `BoroughCode`, `HouseNumber`, `StreetName`, `ZipCode`.
Outputs a CSV (either to STDOUT or a file) with the additional field `lngLat` (WGS84 longitude, latitude).

```
BoroughCode, HouseNumber, StreetName, ZipCode
"MANHATTAN", "1319", "ST NICHOLAS AVENUE", "10003"
```

`BoroughCode` corresponds to which NYC borough the address is in. Many official NYC datasets use the official numbering system (Manhattan: 1, Bronx: 2, Brooklyn: 3, Queens: 4, Staten Island: 5), but this can also just use the borough's name. For all matching names, please see the [boroughcodes data file](src/data/boroughcodes.js).

# Docker
## Docker Quickstart
A version of this tool is hosted as [pre-built Docker image](https://hub.docker.com/r/riordan/nyc-batch-geocoder/). For most users, this is the recommended way of working with this tool (as the underlying library runs only on Linux, and lets be honest, you're probably on a Mac.) If you already have a properly-structured CSV (see _Data Formatting_ section below), you can run this tool from the command line without having to finagle with installing Geosupport.

From your OSX/ \*nix command line:

```
cat {YOUR-INPUT.csv} | docker run -it riordan/nyc-batch-geocoder node src/index.js -i - -o - > {YOUR-GEOCODED-OUTPUT.csv}
```

(or if you're a windows user, replace `cat {YOUR-INPUT.csv}` with `type {YOUR-INPUT.CSV}`).


# Instructions
## Installation
Two options are provided for working with this tool:

1. Install directly on Linux ([Instructions for Ubuntu 16.04](INSTALL.md))
2. Run from within [Docker](https://www.docker.com/products/overview#/install_the_platform) (suggested)

To build the docker image, run:
```bash
docker build -t nyc-batch-geocoder .
```

##  Geocoding-ing
### Data Formatting
Get your data into the proper form. The script assumes you have your addresses in a csv file in the data folder called  `data/addresses.csv`. It requires the following columns: `BoroughCode` (explained below), `HouseNumber`, `StreetName`, `ZipCode`. Additional columns (not named `tract`, `building`, or `lonLat`) are fine.
```
BoroughCode, HouseNumber, StreetName, ZipCode
"1", "1319", "ST NICHOLAS AVENUE", "10003"
```
`BoroughCode` corresponds to which NYC borough the address is in. Many official NYC datasets use the official numbering system (Manhattan: 1, Bronx: 2, Brooklyn: 3, Queens: 4, Staten Island: 5), but this can also just use the borough's name. For all matching names, please see the [boroughcodes data file](src/data/boroughcodes.js).

You can have any other fields you wish in the CSV (e.g. keys, IDs, etc.) and it _should_ be preserved, unless the key is: either  `tract`, `block`, `lngLat`. These three keys will be overwritten when run through the geocoder in the output file.

### Running the geocoder
There are two ways to run the geocoder: with `node nyc-batch-geocoder` directly reading/writing files, or via Unix streaming.

**File read/write mode**
1. Put your addresses into `data/addresses.json` (as directed above)
2. RUN THE GEOCODER: From within the `nyc-batch-geocoder` folder, run: `docker run -t -v $PWD/data:/nyc-batch-geocoder/data riordan:nyc-batch-geocoder > data/geocoded.csv`
3. Wait, but not too long. Your addresses will be geocoded into `data/geocoded.csv`

**NOTE**: the `-v $PWD/data:/nyc-batch-geocoder/data` part of running the geocoder is critical to making this work. Inside the Docker container, the geocoder expects your data to live at `/nyc-batch-geocoder/data`. To get your data there, this command mounts your local `data/` folder so it is also readable from within the Docker container.

_Streaming output:_ By default, this program streams its output to stdout, which normally prints to the terminal. The `>` character in `> data/geocoded.csv` instead directs the output of this process into a local file at `data/geocoded.csv`.

# Acknowledgements
I've done literally the smallest amount of work on this project of anyone involved in bringing it to you. This project is very much one of those "Standing On the Shoulders of Giants" endeavors. The following folks and organizations are really the ones to thank.

* This would not at all be possible without the several generations of employees at NYC's [Department of City Planning](http://www1.nyc.gov/site/planning/index.page) and [Department of Information Technology & Telecommunications (DOITT)](http://www1.nyc.gov/site/planning/index.page) for developing, updating, shepherding, and eventually publicly releasing Geosupport. Geosupport was built as a custom geocoder for the City of New York to run on IBM Mainframes **beginning in 1983**. But what makes Geoupport so amazing is that it has been **continuously developed since 1983**; it gets better _every single year_. It's still a critical tool for the City of New York, and over generations of employees, they've dealt with making sense of the edge cases that only happen in NYC. This is clearly a tool that's been evolved over time, so it's not the prettiest or most modern thing to work with, but I would happily trade that all off for the incredible breadth of data that only it can make available. The [Geosupport Users Guide](https://www1.nyc.gov/assets/planning/download/pdf/data-maps/open-data/upg.pdf?r=16c) covers a bit more of this history. I wish I knew everyone involved in this effort over the years so I could thank them here by name. If you've been involved with the history, please [reach out](mailto:dr@daveriordan.com). I'd love to be able to know, document, and share more of Geosupport's story.
* [Matthew Lipper](https://github.com/mlipper), the primary author of [Geoclient](https://github.com/CityOfNewYork/geoclient), NYC's [official web API to Geosupport](https://api.cityofnewyork.us/geoclient/v1/doc), which has been a major aide to this effort
* [Chris Whong](https://github.com/chriswhong), a NYC data liberator extraordinaire. From working within NYC City Planning, Chris [started investigating how to use Geosupport locally](https://gist.github.com/chriswhong/2e5f0f41fc5d366ec902613251445b30), which kind of kick-started this effort.
* [Noah Veltman](http://noahveltman.com), ["The Rodger Federer of Internet Research"](http://noahveltman.com/about/) and data journalist. Noah picked up Chris' work, built a [proof of concept in Node.js](https://gist.github.com/veltman/2c79458b2226466920dbd601bf94551f), and then–importantly–[tweeted about it](https://twitter.com/veltman/status/785611039832322048), which ultimately brought my attention to the effort. Chris & Noah are working on [a node-geosupport library](https://github.com/veltman/node-geosupport). It is still in progress.
