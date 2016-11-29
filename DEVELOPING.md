This document will eventually specify development protocols for this project.

For now it's notes!

# Running Docker for development`
```bash
docker run -it -v $PWD/data:/nyc-batch-geocoder/data -v $PWD/src:/nyc-batch-geocoder/src nyc-batch-geocoder /bin/bash
```

Remember, if you `npm install --save` while in your host, it doesn't automatically get reflected in docker package.json.
