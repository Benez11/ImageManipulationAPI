# ImageManipulationAPI
A Node JS application that exposes APIs that transform uploaded images (crop, rotate, resize) and allow for their download post-transformation

# Pre-requisites:
You need to have these installed:
- Git
- Node JS


## Get started by:
Perform these steps using your CLI tool:
1. Clone this repository (usually with "git clone <repo_URL>")
2. Install required packages with `npm i`
3. Start the application with `npm start`


## API Endpoints:
The application exposes the APIs:

Endpoint: *"/upload"*

Method: POST

Additional Data Parsed Into Request "Body"

Acceptable Data:
- "image" This would contain the file data
- "crop" e.g `{ crop: "x=2;y=4;w=3;h=10" }`
// x - horizontal distance from origin, y - vertical distance from origin, w - the width of new image, h - the height of new image
- "scale" e.g `{ scale: "f=1.5" }` // f - scale factor
- "resize" e.g `{ resize: "w=3;h=10" }` // w - the width of new image, h - the height of new image
- "rotate" e.g `{ rotate: "d=90" }` // d - degrees
