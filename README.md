# ImageManipulationAPI
A Node JS application that exposes APIs that transform uploaded images (crop, rotate, resize) and allow for their download post-transformation

# Pre-requisites:
You need to have these installed:
- Git
- Node JS


## Get started by:
Perform these steps using your CLI tool:
1. Clone this repository (usually with `git clone <REPO_URL>`)
2. Install required packages with `npm install`
3. Start the application with `npm start`


## API endpoints:
The application exposes the APIs:

### 1. URL: `"/upload"`
Method: `POST`
Acceptable Data (Request `Body`):
+ **image:** This would contain the file data
+ **crop:** e.g `{ crop: "x=2;y=4;w=3;h=10" }`

    x - horizontal distance from origin,
    y - vertical distance from origin,
    w - the width of new image,
    h - the height of new image
    
+ **scale:** e.g `{ scale: "f=1.5" }`

    f - scale factor
    
+ **resize:** e.g `{ resize: "w=3;h=10" }`
    w - the width of new image,
    h - the height of new image
+ **rotate:** e.g `{ rotate: "d=90" }`
    d - degrees
+ **order:** e.g `{ order: "sc;re;ro;cr" }`
    sc - scale
    re - resize
    ro - rotate
    cr - crop
    //default order: "re;ro;sc;cr" meaning the worker should first 'resize', then 'rotate', then 'scale' and lastly 'crop' the parsed image.

*Example:*
```javascript
axios({
    method: 'post',
    url: '/upload',
    data: {
        image: imageFile,
        crop: "x=2;y=4;w=3;h=10",
        scale: "f=1.5",
        resize: "w=3;h=10",
        rotate: "d=90",
        order: "sc;ro;re;cr"
    }
})
 .then(function (response) {
    //handle success
    console.log(response);
 })
 .catch(function (response) {
    //handle error
    console.log(response);
 });
```
