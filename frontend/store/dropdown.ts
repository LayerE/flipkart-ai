import assets from "@/public/assets";
import Beach from '@/public/assets/image/Beach.png'
import Kitchen from '@/public/assets/image/Kitchen.png'
import Livingroom from '@/public/assets/image/Living Room.png'
import LivingRoom from '@/public/assets/image/LivingRoom.png'
import Minimal from '@/public/assets/image/Minimal.png'
import   Rocks from '@/public/assets/image/Rocks.png'
import  Room from '@/public/assets/image/Room.png'
import  Waterfalls from '@/public/assets/image/Waterfalls.png'
export const category = ["Mobile", "Electronics", "Large Items", "Furnitures"];


export const placementList = [
  "Mobile",
  "Electronics",
  "Large Items",
  "Furnitures",
];
export const surroundingList = [
  "Mobile",
  "Electronics",
  "Large Items",
  "Furnitures",
];

export const BackgroundList = [
  "Mobile",
  "Electronics",
  "Large Items",
  "Furnitures",
];
export const coloreMode = ["None", "Add", "Multiply", "Overlay"];
export const Loara = ["RealisticNaturalScenery", "InteriorDesign", "AbstractPattern"];


export const productSuggestions = ["bottle", "can", "box", "bag", "device"];
export const PlacementSuggestions = [
  "circular platform",
  "circular reflective platform",
  "flower patch",
  "a marble block",
  "a mound of grass",
  "a grassy hill",
];
export const productSuggestionsPrash = [
  "on",
  "standing on",
  "laying on",
  "balancing on",
  "buried in",
  "emerging from",
  "in",
];
export const SurroundedSuggestions = [
  " trees",
  "leaves",
  "autumn leaves",
  "wavy fabrics",
  "dried bark",
  "potted plant",
];
export const SurrontedSuggestionsPrash = [
  "with",
  "next to",
  "surrounded by ",
 
];
export const BackgroundSuggestions = [
  "soft shadows",
  "the ocean and blue skies with clouds",
  "desert in the background",
  "marsh with sunlight streaming down in the background",
  "fairy lights in the background",
  "a white circular window",
];
export const BackgrowundSuggestionsPrash = [
  "in front of",
  "against",
  "with",
];
export const resultList = [
  {
    tittle: 1,
  },
  {
    tittle: 2,
  },
  {
    tittle: 3,
  },
  {
    tittle: 4,
  },
];

export const renderStrength = [
  {
    tittle: "Extra Weak",
  },
  {
    tittle: "Weak",
  },
  {
    tittle: "Default",
  },
  {
    tittle: "Strong ",
  },
  {
    tittle: "Extra Strong",
  },
];
export const coloreStrength = [
  {
    tittle: "None",
  },
  {
    tittle: "Weak",
  },
  {
    tittle: "Default",
  },
  {
    tittle: "Strong ",
  },
  {
    tittle: "Extra Strong",
  },
];
export const outlineStrength = [
  {
    tittle: "None",
  },
  {
    tittle: "Extra Weak",
  },
  {
    tittle: "Weak",
  },
  {
    tittle: "Default",
  },
  {
    tittle: "Strong ",
  },
  {
    tittle: "Extra Strong",
  },
];

export const templets = [
  {
    title:"Beach ",

    image:
   "https://www.linkpicture.com/q/Beach_1.png",
    promt: "on a beach",
    placementType: "on",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a beach",
    surrounding: "",
    background:
      "",
      lora: "RealisticNaturalScenery"
  },
  {
    title:"Minimal ",

    image:
   "https://www.linkpicture.com/q/Minimal.png",

    promt: " in a minimalistic background",
    placementType: "in",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a minimalistic background",
    surrounding: "",
    background: "",
    lora: "AbstractPattern"

  },
  {
    title:"Kitchen ",

    image:
    "https://www.linkpicture.com/q/Kitchen_1.png",

    promt: " in a Kitchen background",
    placementType: "in",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a Kitchen background",
    surrounding: "",
    background: "",
    lora: "InteriorDesign"

  },

  {
    title:"Living Room ",

    image:
    "https://www.linkpicture.com/q/Living-Room.png",

    promt: " in a Living Room  background",
    placementType: "in",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a Living room  background",
    surrounding: "",
    background: "",
    lora: "InteriorDesign"

  },
  {
    title:"Rocks ",

    image:
    "https://www.linkpicture.com/q/Rocks.png",

    promt: " top of  rock backgroundd",
    placementType: "on",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: " top of  rock background",
    surrounding: "",
    background: "",
    lora: "RealisticNaturalScenery "

  },
  {
    title:"Room",

    image:
    "https://www.linkpicture.com/q/Room.png",

    promt: " in a Room background",
    placementType: "in front of",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a Room background",
    surrounding: "",
    background: "",
    lora: "InteriorDesign "

  },
  {
    title:"Forest ",

    image:
    "https://www.linkpicture.com/q/Forest_1.png",

    promt: " surroubded byForest background",
    placementType: "",
    surroundingType: "surroubded by",
    backgroundType: "",
    product: "",
    placement: "",
    surrounding: "Forest",
    background: "",
    lora: "RealisticNaturalScenery"

  },
  {
    title:"Waterfalls ",

    image:
   "https://www.linkpicture.com/q/Waterfalls.png",

    promt: " in a minimalistic background",
    placementType: "",
    surroundingType: "next to",
    backgroundType: "",
    product: "",
    placement: "a Waterfalls",
    surrounding: "",
    background: "",
    lora: "RealisticNaturalScenery"

  },
 
  // {
  //   title:"luxurious House ",
  //   image:
  //     "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fabstract.jpeg&w=256&q=75",
  //   promt: "in front of luxurious house",
  //   product: "",
  //   placementType: "",
  //   surroundingType: "",
  //   backgroundType: "",
  //   placement: " ",
  //   surrounding: "",
  //   background: "in front of luxurious house",
  // },
  {
    title:"Abstract ",
    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fabstract.jpeg&w=256&q=75",
    promt: "in an abstract background",
    product: "",
    placementType: "in",
    surroundingType: "",
    backgroundType: "",
    placement: " an abstract background",
    surrounding: "",
    background: "",
    lora: "AbstractPattern"

  },
  {
    title:" Fabric",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Ffabric.jpeg&w=256&q=75",
    promt: "against a fabric background",
    placementType: "against",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a fabric background",
    surrounding: "",
    background: "",
    lora: "AbstractPattern"

  },
 
 
  {
    title:" Road",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Froad.jpeg&w=256&q=75",
    promt: "on",
    placementType: "on",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a roads",
    surrounding: "",
    background:
      "",
      lora: "RealisticNaturalScenery"

  },
  {
    title:" Stand",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fstand.jpeg&w=256&q=75",
    promt: "on a stand",
    placementType: "on",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a stand",
    surrounding: "",
    background:
      "",
      lora: "InteriorDesign "

  },
  {
    title:" Stones",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fstones.jpeg&w=256&q=75",
    promt: "in a background of stones",
    placementType: "in",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a background of stones",
    surrounding: "",
    background:
      "",
      lora: " RealisticNaturalScenery"

  },
  {
    title:"Table ",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Ftable.jpeg&w=256&q=75",
    promt: "on a table",
    placementType: "on",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a table",
    surrounding: "",
    background:
      "",
      lora: "InteriorDesign"

  },
  {
    title:"Texture ",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Ftexture.jpeg&w=256&q=75",
    promt: "against a textured background",
    placementType: "against",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a textured background",
    surrounding: "",
    background:
      "",
      lora: "AbstractPattern"

  },
  {
    title:"Wood ",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fwood.jpeg&w=256&q=75",
    promt: "against a wooden background",
    placementType: "against",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a wooden background",
    surrounding: "",
    background:
      "",
      lora: "RealisticNaturalScenery "

  },
  {
    title:"Colorful ",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fcolorful.jpeg&w=256&q=75",
    promt: "against a colorful background",
    placementType: "against",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a colorful backgroun",
    surrounding: "",
    background:
      "",
      lora: "AbstractPattern"

  },
  {
    title:"Wall ",

    image:
      "https://chromaticlens.com/_next/image?url=%2Fplaces%2Fwall.jpeg&w=256&q=75",
    promt: "against a wall",
    placementType: "against",
    surroundingType: "",
    backgroundType: "",
    product: "",
    placement: "a wall",
    surrounding: "",
    background:
      "",
      lora: "AbstractPattern"

  },

];
