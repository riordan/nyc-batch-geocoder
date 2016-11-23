Geocode NYC! Really Fast! In Docker!
======================

Based on Noah [@Veltman's](https://github.com/veltman) [Geosupport w/ JS and node-ffi](https://gist.github.com/veltman/2c79458b2226466920dbd601bf94551f),  itself based on brilliant work by [Chris Whong](https://gist.github.com/chriswhong/2e5f0f41fc5d366ec902613251445b30).

# Instructions
## Build Docker Image
1. Have Docker
2. Build Docker image locally by typing `docker build -t nyc-batch-geocoder`

##  Geocoding-ing
### Data Formatting
Get your data into the proper form. The script assumes you have your addresses in a json file in the data folder called  `data/addresses.json` formatted like so:
```
[
  {
    "Ticket Number": "040224903M",
    "BoroughCode": 1,
    "HouseNumber": 1319,
    "StreetName": "ST NICHOLAS AVENUE",
    "ZipCode": 10033
  },
  {...}
}
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
2. RUN THE GEOCODER: From within the `nyc-geocode` folder, run: `docker run -t -v $PWD/data:/geocoding/data node-geosupport > data/geocoded.json`
3. Wait, but not too long. Your addresses will be geocoded into `data/geocoded.json`

**NOTE**: the `-v $PWD/data:/geocoding/data` part of running the geocoder is critical to making this work. Inside the Docker container, the geocoder expects your data to live at `/geocoding/data`. To get your data there, this command mounts your local `data/` folder so it is also readable from within the Docker container.

_Streaming output:_ By default, this program streams its output to stdout, which normally prints to the terminal. The `>` character in `> data/geocoded.json` instead directs the output of this process into a local file at `data/geocoded.json`. Yes, I realize it's inconsistent that it reads from the container's filesystem, but just streams to stdout, but I'm going to fix that soon I promise. That way we'll be able to `cat` data in. Eventually.

# Next Steps
- [x] Play nice with streams so large files don't make it cry
- [ ] Work with CSVs or JSON
 - [ ] CSVs in
 - [ ] CSVs out
- [ ] Automatic borough matching
- [ ] Specify input and output files (or better yet still, stream by default)
- [ ] Rewrite to use @chriswhong and @veltman's [node-geosupport](https://github.com/veltman/node-geosupport)
