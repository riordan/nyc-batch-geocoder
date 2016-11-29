Geocode NYC! Really Fast! In Docker!
======================

Based on Noah [@Veltman's](https://github.com/veltman) [Geosupport w/ JS and node-ffi](https://gist.github.com/veltman/2c79458b2226466920dbd601bf94551f),  itself based on brilliant work by [Chris Whong](https://gist.github.com/chriswhong/2e5f0f41fc5d366ec902613251445b30).

# Instructions
## Installation
Two options are provided for working with this tool:
1. [Install directly on Linux](INSTALL.md)
2. Run from within [Docker]() (suggested)

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
**NOTE:** `BoroughCode` corresponds to which NYC borough the address is in:
* Manhattan: 1
* Bronx: 2
* Brooklyn: 3
* Queens: 4
* Staten Island: 5

You can have any other data you wish in the JSON object (e.g. keys, IDs, etc.) and it _should_ be preserved, unless the key is: either  `tract`, `block`, `lngLat`. These three keys will be overwritten when run through the geocoder in the output file.

### Running the geocoder
1. Put your addresses into `data/addresses.json` (as directed above)
2. RUN THE GEOCODER: From within the `nyc-batch-geocoder` folder, run: `docker run -t -v $PWD/data:/nyc-batch-geocoder/data nyc-batch-geocoder > data/geocoded.csv`
3. Wait, but not too long. Your addresses will be geocoded into `data/geocoded.csv`

**NOTE**: the `-v $PWD/data:/nyc-batch-geocoder/data` part of running the geocoder is critical to making this work. Inside the Docker container, the geocoder expects your data to live at `/nyc-batch-geocoder/data`. To get your data there, this command mounts your local `data/` folder so it is also readable from within the Docker container.

_Streaming output:_ By default, this program streams its output to stdout, which normally prints to the terminal. The `>` character in `> data/geocoded.csv` instead directs the output of this process into a local file at `data/geocoded.csv`. Yes, I realize it's inconsistent that it reads from the container's filesystem, but just streams to stdout, but I'm going to fix that soon I promise. That way we'll be able to `cat` data in. Eventually.

# Next Steps
- [x] Play nice with streams so large files don't make it cry
- [x] Work with CSVs or JSON
 - [x] CSVs in
 - [x] CSVs out
- [ ] Automatic borough matching
- [ ] Specify input and output files (or better yet still, stream by default)
- [ ] Rewrite to use @chriswhong and @veltman's [node-geosupport](https://github.com/veltman/node-geosupport)
