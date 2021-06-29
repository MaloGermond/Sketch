let manifest = {};
let sharedTextStyle = {};
let sharedLayerStyle = {};

function setup() {
  noCanvas();
  readFile();
}

function createTextStyles() {
  let styles = [];
  for (var size in manifest.fonts) {
    if (
      document.getElementById("optionTextStyle").value == size ||
      document.getElementById("optionTextStyle").value == "all"
    ) {
      for (var surface in manifest.surfaces) {
        for (var style in manifest.surfaces[surface].foreground) {
          for (var state in manifest.surfaces[surface].foreground[style]) {
            let name = size + "/" + surface + "/" + style;
            let fontFamily = manifest.fonts[size].fontFamily;
            let font = fontFamily + "-Regular";
            if (state == "high") {
              font = fontFamily + "-Bold";
            }
            let fontSize = manifest.fonts[size].fontSize;
            let varColor = manifest.surfaces[surface].foreground[style][state];
            console.info(name);
            let color = hexToRgb(getColor(varColor));
            let fontWeight = [];
            let lineHeight = manifest.fonts[size].lineHeight;
            let letterSpacing = manifest.fonts[size].letterSpacing;
            styles.push(
              createTextStyle(
                name + "/left/" + state,
                font,
                fontSize,
                color,
                0,
                lineHeight,
                letterSpacing
              )
            );
            styles.push(
              createTextStyle(
                name + "/right/" + state,
                font,
                fontSize,
                color,
                1,
                lineHeight,
                letterSpacing
              )
            );
            styles.push(
              createTextStyle(
                name + "/center/" + state,
                font,
                fontSize,
                color,
                2,
                lineHeight,
                letterSpacing
              )
            );
          }
        }
      }
    }
  }
  // console.log("styles:");
  // console.log(styles);
  return styles;
}

function createLayerStyle() {
  let styles = {};
  for (var surface in manifest.surfaces) {
    let state = {};
    for (var style in manifest.surfaces[surface].background) {
      console.info(surface + "/" + style);
      state[style] = getColor(manifest.surfaces[surface].background[style]);
    }
    styles[surface] = state;
  }
  return styles;
}

/*

"fontFamily": "Roboto",
"fontSize": 12,
"lineHeight": 16,
"letterSpacing": 0.7,
"textTransform": "uppercase"

*/

function createTextStyle(
  name,
  font,
  fontSize,
  hex,
  alignment,
  lineHeight,
  letterSpacing
) {
  let style = {};
  style.name = name;
  style.font = font;
  style.size = fontSize;
  style.color = hex;
  style.alignment = alignment;
  style.spacing = letterSpacing;
  style.lineHeight = lineHeight;
  style.paragraphSpacing = 0;
  style.textTransform = 0;
  style.strikethrough = 0;
  style.underline = 0;
  return style;
}

function getColor(variable) {
  const regex = /(\w*)/g;
  let color = variable.match(regex);
  if (manifest.colors[color[2]][color[4]] == null) {
    console.error({ variable });
    return;
  }
  let hex = manifest.colors[color[2]][color[4]];
  return hex;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: map(parseInt(result[1], 16), 0, 255, 0, 1),
        green: map(parseInt(result[2], 16), 0, 255, 0, 1),
        blue: map(parseInt(result[3], 16), 0, 255, 0, 1),
        alpha: 1,
      }
    : console.error({ hex });
}

let file = new FileReader();

function readFile() {
  file.readAsText(document.getElementById("pathFile").files[0]);
  console.log("File read");
}

function pathToDocumentis() {
  return document.getElementById("pathFile").value;
}
function exportTextStyle() {
  manifest = JSON.parse(file.result);
  console.log(manifest);
  sharedTextStyle.styles = createTextStyles();
  console.log({ sharedTextStyle });
  saveJSON(
    sharedTextStyle,
    "SharedTextStyle_" +
      document.getElementById("optionTextStyle").value +
      ".json"
  );
}

function exportLayerStyle() {
  manifest = JSON.parse(file.result);
  sharedLayerStyle = createLayerStyle();
  console.log({ sharedLayerStyle });
  saveJSON(sharedLayerStyle, "SharedLayerStyle.json");
}
