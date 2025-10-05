import L from "leaflet";

export const defaultColors = {
  fillColor: "#A8E6CF",
  color: "#88D4B0",
};

export const generateColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs(Math.sin(hash) * 16777215));
  return "#" + color.toString(16).padStart(6, "0");
};

export const getLighterColor = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `#${Math.min(255, r + 20)
    .toString(16)
    .padStart(2, "0")}${Math.min(255, g + 20)
    .toString(16)
    .padStart(2, "0")}${Math.min(255, b + 20)
    .toString(16)
    .padStart(2, "0")}`;
};

const colorCache: { [key: string]: { fillColor: string; color: string } } = {};

export const getDistrictColor = (districtName: string) => {
  if (!colorCache[districtName]) {
    const baseColor = generateColor(districtName);
    colorCache[districtName] = {
      fillColor: baseColor,
      color: getLighterColor(baseColor),
    };
  }
  return colorCache[districtName];
};

export const createCustomIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
