const fs = require("fs"),
  browserSync = require("browser-sync"),
  assetsPath = "../../assets";

// Check /assetsPath exists
if (!fs.existsSync(assetsPath)) {
  console.error("\nAssets-demo Error:\nNo assets folder found at", assetsPath);
  process.exit();
}

// Get list of assets
let assets = fs.readdirSync(assetsPath);

// Filter valid image filetypes
assets = assets.filter(asset => {
  let fileType = asset.split(".").pop();
  return [
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "png",
    "apng",
    "svg",
    "bmp",
    "ico"
  ].includes(fileType);
});

// Create image cycling script
let script = `
console.log('Assets-demo\\nTotal assets: ' + ${assets.length});
var assets = ${JSON.stringify(assets)};
var i = -1;
function cycle() {
  i = (i >= ${assets.length - 1}) ? 0 : ++i;
  console.log('Asset index: ' + i);
  document.getElementById('asset').src = assets[i]
}
cycle();
`;

// Create image caches (doesn't make all that much difference but no reason not to)
const imageCaches = assets.reduce((acc, asset) => {
  return acc + `<img src="${asset}" width="1" height="1" />`;
}, "");

// Generate an assets-demo.html file to go in /assetsPath
let html = `
<html>
<head>
<title>Assets Demo</title>
<style>
body {
  background: #cfcfcf
}
a {
  display: block;
  min-height: 100vh;
  min-width: 100vw;
}
img {
  display: block;
  width: auto;
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 100px rgba(0,0,0,0.2);
}
#preloader {
  position: absolute;
  left: -9999px;
  top:  -9999px;
}
#preloader img {
  display: block;
}
</style>
</head>
<body>
<a href="#" onClick="cycle()"><img id="asset" /></a>
<script>${script}</script>
<div class="preloader">${imageCaches}</div>
</body>
</html>
`;

// Save demo html to /assetsPath
fs.writeFileSync(`${assetsPath}/assets-demo.html`, html);

// Serve the html file (as it'll need to run the script)
browserSync(
  { server: assetsPath, open: "local", index: "assets-demo.html" },
  (err, bs) => {
    console.log(`Opening: ${assetsPath}/assets-demo.html`);
  }
);