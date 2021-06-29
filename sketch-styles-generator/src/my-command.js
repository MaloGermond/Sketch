var sketch = require("sketch");
var resolver = require("./resolver");
var UI = require("sketch/ui");
var crypto = require("crypto");
var brand = "";

const document = sketch.getSelectedDocument();
const selection = document.selectedLayers;
const layers = selection.layers;

const sharedTStyles = document.sharedTextStyles;
const sharedLStyles = document.sharedLayerStyles;

UI.getInputFromUser(
  "What's the brand you want to update?",
  {
    type: UI.INPUT_TYPE.selection,
    possibleValues: [
      "Privowny",
      "Assurant",
      "Moviestar",
      "Comcast",
      "Tmobile",
      "Pocket Geek ID",
    ],
  },
  (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return;
    } else {
      brand = value;
    }
  }
);

switch (brand) {
  case "Privowny":
    var data = require("./OI-manifest.json");
    break;
  case "Assurant":
    var data = require("./AIZ-manifest.json");
    break;
  case "Moviestar":
    var data = require("./MVS-manifest.json");
    break;
  case "Comcast":
    var data = require("./CST-manifest-multicolors.json");
    break;
  case "Tmobile":
    var data = require("./TMB-manifest.json");
    break;
  case "Pocket Geek ID":
    var data = require("./PGID-manifest.json");
    break;
  default:
    break;
}

var json = resolver(data);

function findText(aName) {
  return sharedTStyles.findIndex((object) => {
    return object.name === aName;
  });
}

function findLayer(aName) {
  return sharedLStyles.findIndex((object) => {
    return object.name === aName;
  });
}

function getHash(aName) {
  var h = crypto.createHash("md5").update(aName).digest("hex");
  var d1 = h.substring(0, 8);
  var d2 = h.substring(8, 12);
  var d3 = h.substring(12, 16);
  var d4 = h.substring(16, 20);
  var d5 = h.substring(20, 32);

  return d1 + "-" + d2 + "-" + d3 + "-" + d4 + "-" + d5;
}

//var j = 0;
// creation de toutes les fonts
var fonts_progress = 0;
var layers_progress = 0;
var borders_progress = 0;
var fonts_progress_step =
  100 / (Object.keys(json.colors).length * Object.keys(json.fonts).length);
// default font_family

for (var key_fonts in json.fonts) {
  //j = ++j;
  //if(j>1){continue};
  var weight;
  switch (json.fonts[key_fonts].fontWeight) {
    case "light":
      weight = 3;
      break;
    case "regular":
      weight = 5;
      break;
    case "medium":
      weight = 6;
      break;
    case "semibold":
      weight = 8;
      break;
    case "bold":
      weight = 9;
      break;
    case "black":
      weight = 11;
      break;
    default:
      console.log(
        "############ Font weight non connu, on remplace par regular"
      );
      weight = 5;
      break;
  }
  var font_family;
  switch (json.fonts[key_fonts].fontFamily) {
    case "roboto":
      font_family = "Roboto";
      break;
    case "opensans":
      font_family = "Open Sans";
      break;
    default:
      console.log("####### Font non connue, on remplace par roboto");
      font_family = "Roboto";
      break;
  }

  for (var i = 0, keys = Object.keys(json.colors); i < keys.length; i++) {
    var key = keys[i];
    //for (var key in json.colors) {
    // je zappe si le nom inclus "lighter" ou n'inclu pas "high, medium, disabled, light"
    if (
      key.includes("lighter") ||
      !(
        key.includes("high") ||
        key.includes("medium") ||
        key.includes("disabled") ||
        key.includes("light")
      )
    ) {
      fonts_progress = fonts_progress + fonts_progress_step;
      continue;
    }
    fonts_progress = fonts_progress + fonts_progress_step;

    const key_back = key;
    key = key.split("/")[0] + "/" + key.split("/")[1];

    //var alignment = ['left', 'center', 'right'];
    var alignment = "left";

    var name =
      key_fonts + "/" + key + "/" + alignment + "/" + key_back.split("/")[2];

    let index1 = findText(name);
    if (index1 >= 0) {
      // mise à jour du style trouvé
      sharedTStyles[index1].style.textColor =
        json.colors[key_back].color +
        Math.round(json.colors[key_back].opacity * 255).toString(16);
      sharedTStyles[index1].style.fontSize = json.fonts[key_fonts].fontSize;
      sharedTStyles[index1].style.fontWeight = weight;
      sharedTStyles[index1].style.fontFamily = font_family;
      sharedTStyles[index1].style.lineHeight = json.fonts[key_fonts].lineHeight;
      sharedTStyles[index1].style.kerning = json.fonts[key_fonts].letterSpacing;
      sharedTStyles[index1].style.textTransform =
        json.fonts[key_fonts].textTransform;
      sharedTStyles[index1].style.verticalAlignment = "top";
    } else {
      // création d'un nouveau style
      sharedTStyles.push({
        name: name,
        style: {
          type: "Style",
          opacity: 1,
          borderOptions: {
            startArrowhead: "None",
            endArrowhead: "None",
            dashPattern: [],
            lineEnd: "Butt",
            lineJoin: "Miter",
          },
          fills: [],
          borders: [],
          shadows: [],
          styleType: "Text",
          alignment: alignment,
          verticalAlignment: "top",
          kerning: json.fonts[key_fonts].letterSpacing,
          lineHeight: json.fonts[key_fonts].lineHeight,
          textColor:
            json.colors[key_back].color +
            Math.round(json.colors[key_back].opacity * 255).toString(16),
          fontSize: json.fonts[key_fonts].fontSize,
          textTransform:
            json.fonts[key_fonts].textTransform == undefined
              ? "none"
              : json.fonts[key_fonts].textTransform,
          fontFamily: font_family,
          fontWeight: weight,
          fontStyle: undefined,
          fontVariant: undefined,
          fontStretch: undefined,
          textUnderline: undefined,
          textStrikethrough: undefined,
        },
      });
    }

    var alignment = "center";

    var name =
      key_fonts + "/" + key + "/" + alignment + "/" + key_back.split("/")[2];

    let index2 = findText(name);
    if (index2 >= 0) {
      // mise à jour du style trouvé
      sharedTStyles[index2].style.textColor =
        json.colors[key_back].color +
        Math.round(json.colors[key_back].opacity * 255).toString(16);
      sharedTStyles[index2].style.fontSize = json.fonts[key_fonts].fontSize;
      sharedTStyles[index2].style.fontWeight = weight;
      sharedTStyles[index2].style.fontFamily = font_family;
      sharedTStyles[index2].style.lineHeight = json.fonts[key_fonts].lineHeight;
      sharedTStyles[index2].style.kerning = json.fonts[key_fonts].letterSpacing;
      sharedTStyles[index2].style.textTransform =
        json.fonts[key_fonts].textTransform;
      sharedTStyles[index2].style.verticalAlignment = "top";
    } else {
      // création d'un nouveau style
      sharedTStyles.push({
        name: name,
        style: {
          type: "Style",
          opacity: 1,
          borderOptions: {
            startArrowhead: "None",
            endArrowhead: "None",
            dashPattern: [],
            lineEnd: "Butt",
            lineJoin: "Miter",
          },
          fills: [],
          borders: [],
          shadows: [],
          styleType: "Text",
          alignment: alignment,
          verticalAlignment: "top",
          kerning: json.fonts[key_fonts].letterSpacing,
          lineHeight: json.fonts[key_fonts].lineHeight,
          textColor:
            json.colors[key_back].color +
            Math.round(json.colors[key_back].opacity * 255).toString(16),
          fontSize: json.fonts[key_fonts].fontSize,
          textTransform:
            json.fonts[key_fonts].textTransform == undefined
              ? "none"
              : json.fonts[key_fonts].textTransform,
          fontFamily: font_family,
          fontWeight: weight,
          fontStyle: undefined,
          fontVariant: undefined,
          fontStretch: undefined,
          textUnderline: undefined,
          textStrikethrough: undefined,
        },
      });
    }

    var alignment = "right";

    var name =
      key_fonts + "/" + key + "/" + alignment + "/" + key_back.split("/")[2];

    let index3 = findText(name);
    if (index3 >= 0) {
      // mise à jour du style trouvé
      sharedTStyles[index3].style.textColor =
        json.colors[key_back].color +
        Math.round(json.colors[key_back].opacity * 255).toString(16);
      sharedTStyles[index3].style.fontSize = json.fonts[key_fonts].fontSize;
      sharedTStyles[index3].style.fontWeight = weight;
      sharedTStyles[index3].style.fontFamily = font_family;
      sharedTStyles[index3].style.lineHeight = json.fonts[key_fonts].lineHeight;
      sharedTStyles[index3].style.kerning = json.fonts[key_fonts].letterSpacing;
      sharedTStyles[index3].style.textTransform =
        json.fonts[key_fonts].textTransform;
      sharedTStyles[index3].style.verticalAlignment = "top";
    } else {
      // création d'un nouveau style
      sharedTStyles.push({
        name: name,
        style: {
          type: "Style",
          opacity: 1,
          borderOptions: {
            startArrowhead: "None",
            endArrowhead: "None",
            dashPattern: [],
            lineEnd: "Butt",
            lineJoin: "Miter",
          },
          fills: [],
          borders: [],
          shadows: [],
          styleType: "Text",
          alignment: alignment,
          verticalAlignment: "top",
          kerning: json.fonts[key_fonts].letterSpacing,
          lineHeight: json.fonts[key_fonts].lineHeight,
          textColor:
            json.colors[key_back].color +
            Math.round(json.colors[key_back].opacity * 255).toString(16),
          fontSize: json.fonts[key_fonts].fontSize,
          textTransform:
            json.fonts[key_fonts].textTransform == undefined
              ? "none"
              : json.fonts[key_fonts].textTransform,
          fontFamily: font_family,
          fontWeight: weight,
          fontStyle: undefined,
          fontVariant: undefined,
          fontStretch: undefined,
          textUnderline: undefined,
          textStrikethrough: undefined,
        },
      });
    }
    console.log(
      "Progression fonts: " +
        Math.round(fonts_progress * 100) / 100 +
        "%, layers: " +
        Math.round(layers_progress * 100) / 100 +
        "%, borders: " +
        Math.round(borders_progress * 100) / 100 +
        "%"
    );
  }
}

var layers_progress_step = 100 / Object.keys(json.colors).length;

//var i = 0;
// creation des layers de couleurs
for (var key in json.colors) {
  // je zappe si le nom démarre par "on" et n'inclus pas "high, medium, disabled, light, lighter"
  if (
    key.startsWith("on") &&
    !(
      key.includes("high") ||
      key.includes("medium") ||
      key.includes("disabled") ||
      key.includes("light")
    )
  ) {
    layers_progress = layers_progress + layers_progress_step;
    continue;
  }
  layers_progress = layers_progress + layers_progress_step;
  console.log(
    "Progression fonts: " +
      Math.round(fonts_progress * 100) / 100 +
      "%, layers: " +
      Math.round(layers_progress * 100) / 100 +
      "%, borders: " +
      Math.round(borders_progress * 100) / 100 +
      "%"
  );

  // transform surface050 -> colors/surface/050
  var regex = /([0-9]{3}|main)$/g;
  var name =
    "colors/" + (key.match(regex) ? key.replace(regex, "/" + "$1") : key);

  let index = findLayer(name);
  //console.log("name: " + name);
  //console.log("index: " + index);

  if (index >= 0) {
    sharedLStyles[index].style.fills[0].color =
      json.colors[key].color +
      Math.round(json.colors[key].opacity * 255).toString(16);
  } else {
    sharedLStyles.push({
      name: name,
      style: {
        type: "Style",
        opacity: 1,
        blendingMode: "Normal",
        borderOptions: {
          startArrowhead: "None",
          endArrowhead: "None",
          dashPattern: [],
          lineEnd: "Butt",
          lineJoin: "Miter",
        },
        blur: {
          center: { x: 0.5, y: 0.5 },
          motionAngle: 0,
          radius: 10,
          enabled: false,
          blurType: "Gaussian",
        },
        fills: [
          {
            fillType: "Color",
            color:
              json.colors[key].color +
              Math.round(json.colors[key].opacity * 255).toString(16),
            gradient: [],
            pattern: [],
            enabled: true,
          },
        ],
        borders: [
          {
            fillType: "Color",
            position: "Inside",
            color: "#979797ff",
            gradient: [],
            thickness: 1,
            enabled: false,
          },
        ],
        shadows: [],
        innerShadows: [],
        styleType: "Layer",
      },
    });
  }
}
/*
// creation des layers de borders
for (var key in json.colors) {
    if (key.startsWith("on") && !(key.includes("high") || key.includes("medium") || key.includes("disabled") || key.includes("light"))) {continue;}

    var regex = /([0-9]{3}|main)$/;
    var name = "borders/" + key.replace(regex, "/"+"$1");

	let index = findLayer(name);
	if (index >= 0) {
		sharedLStyles[index].style.borders[0].color = json.colors[key].color + (Math.round(json.colors[key].opacity * 255)).toString(16);
	} else {
		sharedLStyles.push({
			name: name,
			style: {
			  type: 'Style',
			  opacity: 1,
			  blendingMode: 'Normal',
			  borderOptions: {
				 startArrowhead: 'None',
				 endArrowhead: 'None',
				 dashPattern: [],
				 lineEnd: 'Butt',
				 lineJoin: 'Miter' },
			  blur: {
				 center: { x: 0.5, y: 0.5 },
				 motionAngle: 0,
				 radius: 10,
				 enabled: false,
				 blurType: 'Gaussian' },
			  fills: [{
				   fillType: 'Color',
				   color: json.colors[key].color + (Math.round(json.colors[key].opacity * 255)).toString(16),
				   gradient: [],
				   pattern: [],
				   enabled: false } ],
			  borders: [{
				   fillType: 'Color',
				   position: 'Inside',
				   color: json.colors[key].color + (Math.round(json.colors[key].opacity * 255)).toString(16),
				   gradient: [],
				   thickness: 1,
				   enabled: true } ],
			  shadows: [],
			  innerShadows: [],
			  styleType: 'Layer'
			}
		});
	}
}*/
