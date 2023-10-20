import { createContext, useContext, useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import axios from "axios";
import * as THREE from "three";
import { toast } from "react-toastify";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";
import { useSession } from "@supabase/auth-helpers-react";

type ContextProviderProps = {
  children: React.ReactNode;
};


interface ContextITFC {
  canvasInstance: React.MutableRefObject<null>;
  outerDivRef: React.MutableRefObject<any | null>;
  addimgToCanvas: (url: string) => void;
  addimgToCanvasSubject: (url: string) => void;
  addimgToCanvasGen: (url: string) => void;
  editorBox: fabric.Rect | null;
  setEditorBox: (editorBox: fabric.Rect | null) => void;
  getBase64FromUrl: (url: string) => void;
  activeTab: number | null;
  setActiveTab: (activeTab: number) => void;
  activeTabHome: number | null;
  setActiveTabHome: (activeTabHome: number) => void;
  selectedImg: object | null;
  setSelectedImg: (selectedImg: object) => void;
  downloadImg: string | null;
  setDownloadImg: (downloadImg: string) => void;
  isMagic: boolean | null;
  setIsMagic: (isMagic: boolean) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  viewMore: object;
  setViewMore: (viewMore: object) => void;
  selectPlacement: string;
  setSelectedPlacement: (selectPlacement: string) => void;
  surroundingtype: string;
  setSurroundingtype: (surroundingtype: string) => void;
  selectSurrounding: string;
  setSelectedSurrounding: (selectSurrounding: string) => void;
  selectBackground: string;
  setSelectedBackground: (selectBackground: string) => void;
  selectColoreMode: string;
  setSelectedColoreMode: (selectColoreMode: string) => void;
  selectResult: number;
  setSelectedresult: (selectResult: number) => void;
  selectRender: number;
  setSelectedRender: (selectRender: number) => void;
  selectColoreStrength: number;
  setSelectedColoreStrength: (selectColoreStrength: number) => void;
  selectOutLline: number;
  setSelectedOutline: (selectOutLline: number) => void;
  product: string;
  setProduct: (product: string) => void;
  placementTest: string;
  setPlacementTest: (placementTest: string) => void;
  backgroundTest: string;
  setBackgrundTest: (backgrundTest: string) => void;
  surroundingTest: string;
  setSurroundingTest: (surroundingTest: string) => void;
  colore: string;
  setColore: (colore: string) => void;
  uploadedProductlist: string[];
  setUploadedProductlist: (uploadedProductlist: string[]) => void;
  generatedImgList: string[];
  setGeneratedImgList: (generatedImgList: string[]) => void;
  previewLoader: boolean;
  setPriviewLoader: (previewLoader: boolean) => void;
  generationLoader: boolean;
  setGenerationLoader: (generationLoader: boolean) => void;
  loader: boolean;
  setLoader: (loader: boolean) => void;
  modifidImageArray: string[];
  setModifidImageArray: (modifidImageArray: string[]) => void;
  undoArray: string[];
  setUndoArray: (undoArray: string[]) => void;
  EditorBox: any;
  popup: object;
  setPopup: (popup: object) => void;

  stageRef: React.MutableRefObject<any | null>;
  lines: any[];
  setLines: (lines: any[]) => void;
  linesHistory: any[];
  setLinesHistory: (linesHistory: any[]) => void;

  mode: string;
  setMode: (generatedImgList: string) => void;
  magicLoader: boolean;
  setMagicloder: React.Dispatch<React.SetStateAction<boolean>>;
  crop: boolean;
  setCrop: React.Dispatch<React.SetStateAction<boolean>>;
  filsizeMorethan10: boolean;
  setfilsizeMorethan10: React.Dispatch<React.SetStateAction<boolean>>;

  canvasDisable: boolean;
  setCanvasDisable: (canvasDisable: boolean) => void;
  TdImage: any;
  set3DImage: (TdImage: any) => void;
  regenratingId: any;
  setregeneraatingId: (regenratingId: any) => void;
  tdFormate: string;
  setTdFormate: (tdFormate: string) => void;
  file3dUrl: any;
  setFile3dUrl: (file3dUrl: any) => void;
  downloadImgEdit: any;
  setDownloadImgEdit: (downloadImgEdit: any) => void;

  galleryActivTab: string;
  setgalleryActiveTab: (galleryActivTab: string) => void;
  addimgToCanvasCropped: (url: string) => void;
  changeRectangleSize: () => void;

  generate3dHandeler: (ueserId: any, proid: any) => void;

  AssetsActivTab: string;
  setassetsActiveTab: (AssetsActivTab: string) => void;
  magickErase: boolean;
  setmagickErase: (magickErase: boolean) => void;
  customsize: any;
  setCustomsize: (customsize: any) => void;
  zoom: number;
  setZoomCanvas: (zoom: number) => void;
  activeSize: object;
  setActiveSize: (activeSize: object) => void;
}
export const AppContext = createContext<ContextITFC>({
  activeTab: 1,
  setActiveTab: () => {},
  activeTabHome: 1,
  setActiveTabHome: () => {},
  selectedImg: null,
  setSelectedImg: () => {},

  downloadImg: null,
  setDownloadImg: () => {},
  isMagic: null,
  setIsMagic: () => {},
  EditorBox: null,
  editorBox: null,
  setEditorBox: () => {},
  // canvasInstance: null,
  // outerDivRef: null,
  addimgToCanvas: () => {},
  addimgToCanvasSubject: () => {},
  addimgToCanvasGen: () => {},
  modifidImageArray: [],
  setModifidImageArray: (modifidImageArray: string[]) => {},
  undoArray: [],
  setUndoArray: (undoArray: string[]) => {},
  getBase64FromUrl: () => {},
  file: null,
  setFile: () => {},
  viewMore: {},
  setViewMore: (viewMore: Object) => {},
  selectPlacement: "",
  setSelectedPlacement: (selectPlacement: string) => {},
  surroundingtype: "",
  setSurroundingtype: (surroundingtype: string) => {},
  selectSurrounding: "",
  setSelectedSurrounding: (selectSurrounding: string) => {},
  selectBackground: "",
  setSelectedBackground: (selectBackground: string) => {},
  selectColoreMode: "",
  setSelectedColoreMode: (selectColoreMode: string) => {},
  selectResult: 1,
  setSelectedresult: (selectResult: number) => {},
  selectRender: 1,
  setSelectedRender: (selectRender: number) => {},
  selectColoreStrength: 1,
  setSelectedColoreStrength: (selectColoreStrength: number) => {},
  selectOutLline: 1,
  setSelectedOutline: (selectOutLline: number) => {},
  product: "",
  setProduct: (product: string) => "",
  placementTest: "",
  setPlacementTest: (placementTest: string) => "",
  backgroundTest: "",
  setBackgrundTest: (backgrundTest: string) => "",
  surroundingTest: "",
  setSurroundingTest: (surroundingTest: string) => {},
  colore: "",
  setColore: () => {},
  uploadedProductlist: [],
  setUploadedProductlist: (uploadedProductlist: string[]) => {},
  generatedImgList: [],
  setGeneratedImgList: (generatedImgList: string[]) => {},

  previewLoader: false,
  setPriviewLoader: () => {},
  generationLoader: false,
  setGenerationLoader: () => {},
  loader: false,
  setLoader: () => {},

  popup: {},
  setPopup: () => {},

  stageRef: null,
  lines: [],
  setLines: () => {},
  linesHistory: [],
  setLinesHistory: () => {},
  // linesHistory: Array<YourTypeHere>; // Specify the type
  // setLinesHistory: React.Dispatch<React.SetStateAction<Array<YourTypeHere>>>;
  mode: "pen",
  setMode: (mode: string) => {},
  magicLoader: false,
  setMagicloder: () => {},
  crop: false,
  setCrop: () => {},
  filsizeMorethan10: false,
  setfilsizeMorethan10: () => {},
  canvasDisable: false,
  setCanvasDisable: () => {},
  TdImage: "",
  set3DImage: () => {},
  regenratingId: "",
  setregeneraatingId: () => {},
  tdFormate: "",
  setTdFormate: (tdFormate: string) => {},
  file3dUrl: "",
  setFile3dUrl: () => {},
  downloadImgEdit: "",
  setDownloadImgEdit: () => {},
  galleryActivTab: "",
  setgalleryActiveTab: (galleryActivTab: string) => {},
  addimgToCanvasCropped: () => {},
  changeRectangleSize: () => {},
  generate3dHandeler: () => {},

  AssetsActivTab: "",
  setassetsActiveTab: (AssetsActivTab: string) => {},
  magickErase: false,
  setmagickErase: () => {},
  customsize: "",
  setCustomsize: () => {},
  zoom: 0,
  setZoomCanvas: () => {},
  activeSize: {},
  setActiveSize: (activeSize: Object) => {},
});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const canvasInstance = useRef<any | null>(null);
  const [filteredArray, setFilteredArray] = useState([]);

  const outerDivRef = useRef(null);
  const [mainLoader, setMainLoader] = useState(true);
  const [selectedImg, setSelectedImg] = useState<object | null>(null);
  const [downloadImg, setDownloadImg] = useState<string | null>(null);
  const [downloadImgEdit, setDownloadImgEdit] = useState<string | null>(null);

  const [isMagic, setIsMagic] = useState<boolean | null>(false);
  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [activeTabHome, setActiveTabHome] = useState<number | null>(1);
  const [file, setFile] = useState<File | null>(null);
  const [file3d, setFile3d] = useState<File | null>(null);
  const [file3dUrl, setFile3dUrl] = useState<string>(null);
  const [file3dName, setFile3dName] = useState(null);

  const [viewMore, setViewMore] = useState<object>({});
  const [selectPlacement, setSelectedPlacement] = useState<string>("");
  const [selectSurrounding, setSelectedSurrounding] = useState<string>("");
  const [surroundingtype, setSurroundingtype] = useState<string>("");
  const [selectBackground, setSelectedBackground] = useState<string>("");
  const [selectColoreMode, setSelectedColoreMode] = useState<string>("");
  const [selectResult, setSelectedresult] = useState<number>(4);
  const [selectRender, setSelectedRender] = useState<number>(4);
  const [loara, setLoara] = useState<string>("");
  const [templet, setTemplet] = useState();
  const [promt, setpromt] = useState("");
  const [promtFull, setpromtFull] = useState("");
  const [selectColoreStrength, setSelectedColoreStrength] = useState<number>(0);
  const [selectOutLline, setSelectedOutline] = useState<number>(0);
  const [product, setProduct] = useState<string>("");
  const [placementTest, setPlacementTest] = useState<string>("");
  const [surroundingTest, setSurroundingTest] = useState<string>("");
  const [backgroundTest, setBackgrundTest] = useState<string>("");
  const [colore, setColore] = useState<string>("");
  const [uploadedProductlist, setUploadedProductlist] = useState<string[]>([]);
  const [previewLoader, setPriviewLoader] = useState<boolean>(false);
  const [generationLoader, setGenerationLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [modifidImageArray, setModifidImageArray] = useState<string[]>([]);
  const [romovepopu3d, setromovepopu3d] = useState<object>({});

  const [undoArray, setUndoArray] = useState<string[]>([]);
  const [editorBox, setEditorBox] = useState<fabric.Rect | null>(null);
  const [zoom, setZoomCanvas] = useState<number>(0.4);

  const [canvasDisable, setCanvasDisable] = useState<boolean>(false);

  const [popup, setPopup] = useState<object>({});
  const [popupImage, setPopupImage] = useState<object>({});
  const [regeneratePopup, setRegeneratePopup] = useState<object>({});
  const [projectlist, setprojectlist] = useState<object[]>([]);
  const [project, setproject] = useState<object[]>([]);
  const [generatedImgList, setGeneratedImgList] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string[]>([]);
  const [jobIdOne, setJobIdOne] = useState<string[]>([]);
  const [tdFormate, setTdFormate] = useState(".gltf");
  const [regenratingId, setregeneraatingId] = useState(null);
  const PosisionbtnRef = useRef<HTMLElement | null>(null);
  const regenerateRef = useRef<HTMLElement | null>(null);
  const genrateeRef = useRef<HTMLElement | null>(null);
  const generateBox = useRef<HTMLElement | null>(null);
  const previewBox = useRef<HTMLElement | null>(null);
  const [regenratedImgsJobId, setRegenratedImgsJobid] = useState(null);
  const [projectId, setprojectId] = useState(null);
  const [uerId, setUserId] = useState(null);
  const [category, setcategory] = useState(null);
  const [listofassets, setListOfAssets] = useState(null);
  const [listofassetsBarand, setListOfAssetsBrand] = useState(null);
  const [listofassetsById, setListOfAssetsById] = useState([]);
  const [newassetonCanvas, setNewassetonCanvas] = useState(null);
  const [genRect, setgenRect] = useState();
  const [assetLoader, setassetLoader] = useState(false);
  const [assetL3doader, setasset3dLoader] = useState(false);
  const [brandassetLoader, setbrandassetLoader] = useState(false);
  const canvasHistory = useRef<any[]>([]);
  const currentCanvasIndex = useRef(-1);
  const canvasRef = useRef(null);
  const [activeTemplet, setActiveTemplet] = useState(null);
  const [downloadeImgFormate, setDownloadeImgFormate] = useState("png");
  const [incremetPosition, setIncremetPosition] = useState(0);
  const [magickErase, setmagickErase] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [AssetsActivTab, setassetsActiveTab] = useState("product");
  const [galleryActivTab, setgalleryActiveTab] = useState("ai");
  const [TdImage, set3DImage] = useState(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [TDMode, set3dMode] = useState(false);
  const [re, setRe] = useState(1);
  const [linesHistory, setLinesHistory] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [mode, setMode] = useState<string>("pen");
  const [magicLoader, setMagicloder] = useState(false);
  const [crop, setCrop] = useState(false);
  const [filsizeMorethan10, setfilsizeMorethan10] = useState(false);
  const stageRef = useRef(null);
  const [activeSize, setActiveSize] = useState({
    id: 1,
    title: "Default",
    subTittle: "1024✕1024",
    h: 1024,
    w: 1024,
    l: 100,
    t: 240,
    gl: 1152,
    gt: 240,
  });
  const [customsize, setCustomsize] = useState({ w: 1024, h: 1024 });

  const [btnVisible, setBtnVisible] = useState(false);
  const handileDownload = (url: string) => {
    saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
  };



  const getBase64FromUrl = async (url: string): Promise<string> => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        // const base64data = reader.result
        const base64data = reader.result as string;
        resolve(base64data);
      };
    });
  };

  const addEditorBoxToCanvas = () => {
    if (canvasInstance?.current && editorBox) {
      canvasInstance?.current.add(editorBox);
      canvasInstance?.current.renderAll();
    }
  };

  const addimgToCanvas = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      img.scaleToWidth(150);
      // img.scaleToHeight(150);

      const getRandomPosition = (max: number) =>
        Math.floor(Math.random() * max);
      const randomLeft = getRandomPosition(
        canvasInstance?.current.width / 2 - img.width
      );
      const randomTop = getRandomPosition(
        canvasInstance?.current.height - img.height
      );
      img.set({
        left: randomLeft,
        top: randomTop,
        zIndex: 10,
      });
      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        if (rebtn) {
          rebtn.style.display = "none";
          positionBtn(img);
        } else {
          // Handle the case when rebtn is null, if necessary
        }

        // RegeneratepositionBtn(img);
      });
      img.on("moving", () => {
        positionBtn(img);
      });
      img.on("scaling", function () {
        positionBtn(img);
      });
      img.set("zIndex", 10);

      img.set("category", "mask");

      canvasInstance?.current.add(img);
      canvasInstance?.current.renderAll();
      saveCanvasState();
      saveCanvasToDatabase();
    });
  };

  const addimgToCanvasCropped = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions

      img.scaleToWidth(200);
      const canvasWidth = activeSize.w;
      const canvasHeight = activeSize.h;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;
      const getRandomPosition = (max: number) =>
        Math.floor(Math.random() * max);

      const randomLeft = getRandomPosition(
        canvasInstance?.current?.width / 2 - img.width
      );
      const randomTop = getRandomPosition(300);
      img.set({
        left: 300,
        top: 300,
        // scaleX: scaleX,
        // scaleY: scaleY,
      });

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      // If the scaled height exceeds the canvas height, scale it down
      if (scaledHeight > maxHeight) {
        scaledHeight = maxHeight;
        scaledWidth = scaledHeight * imageAspectRatio;
      }

      img.scaleToWidth(activeSize.w / 2);
      img.scaleToHeight(activeSize.w / 2);

      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        if (rebtn) {
          rebtn.style.display = "none";

          const btn = PosisionbtnRef?.current;
          if (btn) {
            btn.style.display = "flex";
            positionBtn(img);
          }
        }
      });

      img.on("moving", () => {
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
          console.log(zoom);
        }

        // RegeneratepositionBtn(img);
      });

      img.on("scaling", () => {
        positionBtn(img);
      });

      img.set({ category: "subject" });
      // canvasInstance.current.clear();
      canvasInstance?.current?.add(img);
      canvasInstance?.current?.setActiveObject(img);
      canvasInstance?.current?.renderAll();
      saveCanvasState();
    });
  };

  const addimgToCanvasSubject = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions

      img.scaleToWidth(200);
      const canvasWidth = activeSize.w;
      const canvasHeight = activeSize.h;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;
      const getRandomPosition = (max: number) =>
        Math.floor(Math.random() * max);

      const randomLeft = getRandomPosition(
        canvasInstance?.current?.width / 2 - img.width
      );
      const randomTop = getRandomPosition(300);
      img.set({
        left: 300,
        top: 300,
        // scaleX: scaleX,
        // scaleY: scaleY,
      });

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      // If the scaled height exceeds the canvas height, scale it down
      if (scaledHeight > maxHeight) {
        scaledHeight = maxHeight;
        scaledWidth = scaledHeight * imageAspectRatio;
      }

      img.scaleToWidth(activeSize.w / 2);
      img.scaleToHeight(activeSize.w / 2);

      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        if (rebtn) {
          rebtn.style.display = "none";
        }
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
        }
        // RegeneratepositionBtn(img);
      });

      img.on("moving", () => {
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
          console.log(zoom);
        }
      });

      img.on("scaling", () => {
        positionBtn(img);
      });

      img.set("zIndex", 10);

      img.set({ category: "subject" });
      canvasInstance?.current?.add(img);
      canvasInstance?.current?.setActiveObject(img);
      canvasInstance?.current?.renderAll();
      saveCanvasState();
    });
  };

  // Implement a function to save the current canvas state
  const saveCanvasState = () => {
    const canvasData = canvasInstance?.current?.toDatalessJSON();
    canvasHistory?.current?.splice(currentCanvasIndex?.current + 1);
    canvasHistory?.current?.push(canvasData);
    currentCanvasIndex.current++;
  };

  function positionBtn(obj: any) {
    const btn = PosisionbtnRef?.current;
    if (btn) {
      const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
      btn.style.left = absCoords.left + 10 + "px";
      btn.style.top = absCoords.top + 10 + "px";
      // btn.style.left = absCoords.left - 150 / 2 + "px";
      // btn.style.top = absCoords.top - 80 / 2 + "px";
    }
  }

  function RegeneratepositionBtn(obj: any) {
    var zooms = canvasInstance?.current.getZoom();

    console.log("regenerate position", zooms);
    const btns = regenerateRef?.current as HTMLElement;
    const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
    btns.style.left =
      absCoords.left - 100 / 2 + (obj.getScaledWidth() * zooms) / 2 + "px";
    btns.style.top = absCoords.top + obj.getScaledHeight() * zooms - 50 + "px";
    setZoomCanvas(zooms);
  }

  const GetProjexts = (getUser: string) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/getprojects?id=${getUser}`)
      .then((response) => {
        setprojectlist(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };

  const saveCanvasToDatabase = async () => {
    const canvasData = canvasInstance.current.toJSON(["category"]);
    if (canvasData.objects.length > 1 && !loadercarna) {
      console.log(canvasData);

      SaveProjexts(userId, projectId, canvasData);
      const filteredResult = generatedImgList.filter((obj: any) =>
        jobId?.includes(obj?.task_id)
      );
    }
  };
  const GetProjextById = (getUser: any) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/project?id=${getUser}`)
      .then((response) => {
        setproject(response.data);
        setJobId(response.data.jobIds);
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };
  const SaveProjexts = async (userId: any, projectId: any, canvas: any) => {
    const json = JSON.stringify({
      user_id: userId,
      project_id: projectId,
      canvasdata: canvas,
    });
    // console.log(json);
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

      const response = await fetch(`/api/canvasdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      const data = await response.json();

      if (
        data &&
        filteredArray[0] &&
        "modified_image_url" in filteredArray[0]
      ) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/addPreview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              userId: userId,
              projectId: projectId,
              img: (filteredArray[0] as any)?.modified_image_url,
            }),
          }
        );
        // console.log(await response.json(), "dfvcvdfvdvcdsd");
        const datares = await response;
      }
      // window.open(`/generate/${datares?._id}`, "_self");

      return data;

      // console.log(await response.json(), "dfvcvdfvdvcdsd");
    } catch (error) {
      // Handle error
    }
  };

  const renameProject = async (userId: any, projectId: any, name: any) => {
    const json = JSON.stringify({
      id: userId,
      projectId: projectId,
      name: name,
    });
    // console.log(json);
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/rename`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      const data = await response.json();

      return data;

      // console.log(await response.json(), "dfvcvdfvdvcdsd");
    } catch (error) {
      // Handle error
    }
  };

  const addimgToCanvasGen = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions

      // img.scaleToWidth(200);
      const canvasWidth = activeSize.w;
      const canvasHeight = activeSize.h;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      img.on("selected", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        rebtn.style.display = "block";
        positionBtn(img);
        RegeneratepositionBtn(img);
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
        }
      });

      img.on("moving", () => {
        const rebtn = regenerateRef?.current as HTMLElement;
        rebtn.style.display = "block";
        positionBtn(img);
        RegeneratepositionBtn(img);
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
        }
      });

      img.on("scaling", () => {
        const btn = PosisionbtnRef?.current;
        if (btn) {
          btn.style.display = "flex";
          positionBtn(img);
        }

        RegeneratepositionBtn(img);
      });

      img.scaleToWidth(scaledWidth);
      img.scaleToHeight(scaledHeight);
      // Set the position of the image
      img.set({
        left: activeSize.gl,
        top: activeSize.gt,
        id: url,

        // scaleX: scaleX,
        // scaleY: scaleY,
      });
      img.set("zIndex", 10);
      setIncremetPosition(incremetPosition + 25);
      img.set("category", "generated");

      // canvasInstance.current.clear();
      canvasInstance?.current.add(img);
      canvasInstance?.current.setActiveObject(img);
      canvasInstance?.current.renderAll();
      saveCanvasState();
      saveCanvasToDatabase();
    });
  };
  const canvasHistoryRef = useRef([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const session = useSession();
  const [userId, setUserID] = useState<string | null>("34afa810-7f7e-4a35-be32-e9c561f35067")
  // const [userId, setUserID] = useState<string | null>(null);
  
  useEffect(() => {
    if (session) {
      setUserID(session.user.id);
    }
  }, [session]);

  const fetchGeneratedImages = async (userId: any) => {
    try {
      const response = await fetch(
        `https://tvjjvhjhvxwpkohjqxld.supabase.co/rest/v1/public_images?select=*&order=created_at.desc&user_id=eq.${userId}`,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp2aGpodnh3cGtvaGpxeGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4Njg5NDQsImV4cCI6MjAwODQ0NDk0NH0.dwKxNDrr7Jw5OjeHgIbk8RLyvJuQVwZ_48Bv71P1n3Y", // Replace with your actual API key
          },
        }
      );
      const data = await response.json();
      if (data?.length) {
        setGeneratedImgList(await data);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssetsImages = async (userId: any, pro: any) => {
    try {
      const response = await fetch(`/api/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
      const data = await response.json();
      console.log(await data, "dfdgfdgfg");

      if (data?.data.length) {
        const revers = data.data.reverse();
        setListOfAssets(revers);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  const fetchAssetsImagesBrant = async (userId: any, pro: any) => {
    try {
      const response = await fetch(`/api/getassets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
      const data = await response.json();
      console.log(await data, "dfdgfdgfg");

      if (data?.length) {
        const revers = data.reverse();
        setListOfAssetsBrand(await revers);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssetsImagesWithProjectId = async (userId: any, pro: any) => {
    try {
      const response = await fetch(`/api/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          project_id: pro,
        }),
      });
      const data = await response.json();
      console.log(data, "dfsgsg");

      if (data?.data.length > 0) {
        setListOfAssetsById(data?.data);
        console.log(listofassetsById, "dfsgsg");
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const addtoRecntly = async (ueserId: any, proid: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/recently`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: ueserId,
          projectId: proid,
          recently: templet,
        }),
      });

      const datares = await response;

      if (datares.ok) {
        GetProjextById(proid);
      }
    } catch (error) {}
  };

  const bringImageToFront = () => {
    const activeObject = canvasInstance?.current.getActiveObject();
    if (activeObject) {
      activeObject.sendBackwards();

      canvasInstance.current.bringToFront(activeObject);
      canvasInstance.current.discardActiveObject();
      canvasInstance.current.renderAll();
    }
  };

  const sendImageToBack = () => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (!activeObject) {
      // alert("Please select an object on the canvas first.");
      toast("Please select an object on the canvas first.");

      return;
    }
    console.log(activeObject);
    canvasInstance.current.sendBackwards(activeObject);
    canvasInstance.current.discardActiveObject();
    // canvas.requestRenderAll();
    canvasInstance.current.renderAll();
  };

  const newEditorBox = new fabric.Rect({
    left: activeSize.l,
    top: activeSize.t,
    width: activeSize.w,
    height: activeSize.h,
    selectable: false,
    fill: "transparent",
    stroke: "rgba(249, 208, 13, 1)",
    strokeWidth: 1,
    excludeFromExport: true,
  } as any);

  const imageGenRect = new fabric.Rect({
    left: 660,
    top: 160,
    width: 512,
    height: 512,
    selectable: false,
    fill: "rgba(249, 208, 13, 0.23)",
    excludeFromExport: true,

    // fill: "transparent",
  });

  const changeRectangleSize = () => {
    // Set the new width and height for the rectangle
    newEditorBox.set({ width: activeSize.w, height: activeSize.h });

    // Redraw the canvas
    canvasInstance?.current.renderAll();
  };
  const generateImageHandeler = async (ueserId: any, proid: any) => {
    var subjectCount = 0;

    canvasInstance?.current.forEachObject(function (obj: any) {
      if (obj.category === "subject") {
        if (newEditorBox.intersectsWithObject(obj)) {
          subjectCount++;
        } else {
        }
      }
    });

    if (category === null) {
      toast("Select your product category first !");
    } else if (subjectCount === 0 && !TDMode) {
      toast("Add product first");
    } else if (!TDMode) {
      // console.log(promt);
      setLoader(true);
      setCanvasDisable(true);
      setGenerationLoader(true);
      const canvas1 = canvasInstance.current;
      try {
        addtoRecntly(ueserId, proid);

        const objects = canvas1.getObjects();
        const subjectObjects: any = [];
        objects.forEach((object: any) => {
          if (object.category === "subject") {
            subjectObjects.push(object);
          }
        });

        // Make image with only the subject objects
        const subjectCanvas = new fabric.Canvas(null, {
          // width: newEditorBox.width,
          // height: newEditorBox.height,
          // top: newEditorBox.top,
          // left: newEditorBox.left,
          left: activeSize.l,
          top: activeSize.t,
          width: activeSize.w,
          height: activeSize.h,
        } as any);

        subjectObjects.forEach((object: any) => {
          const gg = object;
          gg.set({
            left: object.left - activeSize.l,
            top: object.top - activeSize.t,
          });
          subjectCanvas.add(gg);
        });

        const subjectDataUrl = subjectCanvas.toDataURL({format : "png",multiplier:  0.5});
        const subjectDataUrlJson = subjectCanvas.toJSON();
        const updatedObject = {
          width: activeSize.w, // Add the new key-value pair
          height: activeSize.h,
          ...subjectDataUrlJson, // Spread the existing object
        };
        console.log(updatedObject,"dsfdf")

        // const subjectDataUrl = subjectCanvas.toDataURL("image/png");

        subjectObjects.forEach((object: any) => {
          object.set({
            left: object.left + activeSize.l,
            top: object.top + activeSize.t,
          });
          subjectCanvas.remove(object);
          // subjectCanvas.add(object);

          canvasInstance.current.remove(object);

          // maskCanvas.remove(object);
          canvasInstance.current.add(object);
          // canvas.requestRenderAll();
          canvasInstance.current.renderAll();
        });

        console.log(subjectDataUrl, "subject");

        const promtText = promtFull;

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUrl: subjectDataUrl,
            maskDataUrl: null,
            prompt: promtText.trim(),
            user_id: userId,
            category: category,
            lora_type: loara,
            num_images: selectResult,
            caption: product,
          }),
        });

        const generate_response = await response.json();

        if (generate_response?.error) {
          // alert(generate_response?.error);
          toast.error(generate_response?.error);

          setLoader(false);

          return false;
        } else {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API}/jobId`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: ueserId,
                  projectId: proid,
                  jobId: generate_response?.job_id,
                }),
              }
            );
            const datares = await response;

            if (datares.ok) {
              setJobIdOne([generate_response?.job_id]);

              GetProjextById(proid);
            }
            // window.open(`/generate/${datares?._id}`, "_self");
          } catch (error) {}
        }
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setGenerationLoader(false);
      }
    } else {
      if (renderer === null) {
      } else {
        console.log("dsfdfgdg");
        setLoader(true);

        const promtText = promtFull;
        const screenshot = renderer.domElement.toDataURL("image/png");
        var img = new Image();

        // Set an onload event handler
        let scaledDataURL
        img.onload = function () {
            // Scale down the image by setting its width and height to 0.5 times the original dimensions
            img.width *= 0.5;
            img.height *= 0.5;
        
            // Create a canvas to draw the scaled image
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
        
            // Get the scaled data URL
             scaledDataURL = canvas.toDataURL("image/png");
        
            // Now, scaledDataURL contains the data URL of the image scaled down to 0.5 of its original size.
            // You can use it as needed.
        };
        
        // Set the source of the image to the original data URL
        img.src = screenshot;
        
        console.log(scaledDataURL,"fsddsfds");

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUrl: scaledDataURL,
            maskDataUrl: null,
            prompt: promtText.trim(),
            user_id: userId,
            category: category,
            lora_type: loara,
            num_images: selectResult,
          }),
        });

        const generate_response = await response.json();

        if (generate_response?.error) {
          // alert(generate_response?.error);
          toast.error(generate_response?.error);

          setLoader(false);

          return false;
        } else {
          setLoader(true);

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API}/jobId`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: ueserId,
                  projectId: proid,
                  jobId: generate_response?.job_id,
                }),
              }
            );
            const datares = await response;

            if (datares.ok) {
              setJobIdOne([generate_response?.job_id]);

              GetProjextById(proid);
            }
            // window.open(`/generate/${datares?._id}`, "_self");
          } catch (error) {
            setLoader(false);
          }
        }
      }
    }
  };

  const generate3dHandeler = async (ueserId: any, proid: any) => {
    if (category === null) {
      toast("Select your product category first !");
    } else if (!file3dUrl && !file3d) {
      toast("Add a 3d model");
    } else {
      if (renderer === null) {
        toast("Add a 3d model");
      } else {
        setLoader(true);

        const promtText = promtFull;

        // const screenshot = renderer.domElement.toDataURL("image/png");
        const screenshot = renderer.domElement.toDataURL("image/png", 0.5);

        var img = new Image();

        // Set an onload event handler
        let scaledDataURL
        img.onload = async function () {
            // Scale down the image by setting its width and height to 0.5 times the original dimensions
            img.width *= 0.5;
            img.height *= 0.5;
        
            // Create a canvas to draw the scaled image
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
        
            // Get the scaled data URL
             scaledDataURL = canvas.toDataURL("image/png");
             console.log(scaledDataURL,"fsddsfds");

             const response = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                dataUrl: scaledDataURL,
                maskDataUrl: null,
                prompt: promtText.trim(),
                user_id: userId,
                category: category,
                lora_type: loara,
                num_images: selectResult,
                // is_3d : true
                // caption : product
              }),
            });
    
            const generate_response = await response.json();
    
            if (generate_response?.error) {
              // alert(generate_response?.error);
              toast.error(generate_response?.error);
    
              setLoader(false);
    
              return false;
            } else {
              setLoader(true);
    
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API}/jobId3d`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: userId,
                      // projectId: proid,
                      jobId: generate_response?.job_id,
                    }),
                  }
                );
                const datares = await response;
    
                if (datares.ok) {
                  setJobIdOne([generate_response?.job_id]);
    
                  // GetProjextById(proid);
                  axios
                    .get(`${process.env.NEXT_PUBLIC_API}/user?id=${ueserId}`)
                    .then((response) => {
                      console.log(response?.data?.jobIds3D, "dsfgdgfd");
                      setproject(response.data);
                      setJobId(response?.data?.jobIds3D);
                      // return response.data;
                    })
                    .catch((error) => {
                      console.error(error);
                      return error;
                    });
                }
                // window.open(`/generate/${datares?._id}`, "_self");
              } catch (error) {
                setLoader(false);
              }
            }
        
            // Now, scaledDataURL contains the data URL of the image scaled down to 0.5 of its original size.
            // You can use it as needed.
        };
        
        // Set the source of the image to the original data URL
        img.src = screenshot;
        
        console.log(scaledDataURL,"fsddsfds");

    
      }
    }
  };

  const [reloder, setreLoader] = useState(true);

  // regenrate
  const RegenerateImageHandeler = async (
    ueserId: any,
    proid: any,
    img: any
  ) => {
    setLoader(true);
    setGenerationLoader(true);
    try {
      setreLoader(true);

      const promtText = promtFull ? promtFull : " ";

      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: regenratingId,
          user_id: ueserId,
          category: category,

          // lora_type: loara,
          // num_images: 3,
        }),
      });

      const generate_response = await response.json();
      console.log(generate_response, "generate_response");

      if (generate_response?.error) {
        toast.error(generate_response?.error);

        setLoader(false);
        setreLoader(false);

        return false;
      } else {
        try {
          setreLoader(false);

          setRegenratedImgsJobid(generate_response?.job_id);

          console.log(generate_response?.job_id);
        } catch (error) {
          setreLoader(false);
        }
      }

      setTimeout(async function () {
        const loadeImge = await fetchGeneratedImages(ueserId);

        setSelectedImg({
          status: true,
          image: loadeImge[0]?.modified_image_url,
          modifiedImage: loadeImge[0]?.modified_image_url,
        });

        setGeneratedImgList(loadeImge.slice(0, 20));
      }, 30000);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
    }
  };

  const [loadercarna, setloadercarna] = useState(false);



  return (
    <AppContext.Provider
      value={{
        userId,
        setUserID,
        canvasDisable,
        TdImage,
        filsizeMorethan10,
        setfilsizeMorethan10,
        regenratingId,
        setregeneraatingId,
        tdFormate,
        setTdFormate,
        file3dUrl,
        downloadImgEdit,
        setDownloadImgEdit,
        setFile3dUrl,
        set3DImage,
        setCanvasDisable,
        galleryActivTab,
        setgalleryActiveTab,
        addimgToCanvasCropped,
        changeRectangleSize,
        AssetsActivTab,
        setassetsActiveTab,
        crop,
        generate3dHandeler,
        setCrop,
        stageRef,
        mode,
        setMode,
        // handleZoomIn,
        // handleZoomOut,
        magicLoader,
        setMagicloder,
        linesHistory,
        setLinesHistory,
        magickErase,
        setmagickErase,
        lines,
        setLines,
        customsize,
        setCustomsize,
        zoom,
        setZoomCanvas,
        activeTemplet,
        setActiveTemplet,
        brushSize,
        setBrushSize,
        imageGenRect,
        loadercarna,
        setloadercarna,
        listofassetsById,
        setListOfAssetsById,
        previewBox,
        fetchAssetsImagesBrant,
        file3dName,
        setFile3dName,
        loara,
        setLoara,
        romovepopu3d,
        setromovepopu3d,
        promtFull,
        setpromtFull,
        GetProjexts,
        genrateeRef,
        canvasRef,
        file3d,
        setFile3d,
        projectId,
        downloadeImgFormate,
        setDownloadeImgFormate,
        setprojectId,
        uerId,
        setUserId,
        SaveProjexts,
        GetProjextById,
        project,
        setproject,
        saveCanvasToDatabase,
        generateBox,
        canvasHistory,
        currentCanvasIndex,
        regeneratePopup,
        setRegeneratePopup,
        addtoRecntly,
        btnVisible,
        generateImageHandeler,
        setBtnVisible,
        PosisionbtnRef,
        regenerateRef,
        bringImageToFront,
        projectlist,
        renameProject,
        setprojectlist,
        sendImageToBack,
        fetchGeneratedImages,
        handileDownload,
        canvasInstance,
        addimgToCanvasGen,
        genRect,
        setgenRect,
        outerDivRef,
        addimgToCanvas,
        addimgToCanvasSubject,
        selectedImg,
        setSelectedImg,
        getBase64FromUrl,
        RegenerateImageHandeler,
        activeTab,
        setActiveTab,
        activeTabHome,
        setActiveTabHome,
        editorBox,
        setEditorBox,
        addEditorBoxToCanvas,
        regenratedImgsJobId,
        setRegenratedImgsJobid,
        jobId,
        setJobId,
        canvasHistoryRef,
        currentStep,
        setCurrentStep,
        popupImage,
        setPopupImage,
        newassetonCanvas,
        setNewassetonCanvas,
        jobIdOne,
        setJobIdOne,
        file,
        setFile,
        mainLoader,
        activeSize,
        setActiveSize,
        setMainLoader,
        selectPlacement,
        setSelectedPlacement,
        selectSurrounding,
        setSelectedSurrounding,
        surroundingtype,
        setSurroundingtype,
        selectBackground,
        setSelectedBackground,
        selectColoreMode,
        setSelectedColoreMode,
        selectResult,
        setSelectedresult,
        selectRender,
        setSelectedRender,
        selectColoreStrength,
        setSelectedColoreStrength,
        selectOutLline,
        setSelectedOutline,
        product,
        setProduct,
        placementTest,
        setPlacementTest,
        backgroundTest,
        listofassets,
        setListOfAssets,
        setBackgrundTest,
        surroundingTest,
        setSurroundingTest,
        colore,
        setColore,
        uploadedProductlist,
        setUploadedProductlist,
        templet,
        setTemplet,
        previewLoader,
        setPriviewLoader,
        generationLoader,
        setGenerationLoader,
        viewMore,
        fetchAssetsImages,
        setViewMore,
        isMagic,
        setIsMagic,
        downloadImg,
        listofassetsBarand,
        setListOfAssetsBrand,
        setDownloadImg,
        popup,
        setPopup,
        generatedImgList,
        setGeneratedImgList,
        loader,
        setLoader,
        positionBtn,
        promt,
        assetLoader,
        setassetLoader,
        brandassetLoader,
        setbrandassetLoader,
        setpromt,
        undoArray,
        setUndoArray,
        modifidImageArray,
        setModifidImageArray,
        fetchAssetsImagesWithProjectId,
        filteredArray,
        setFilteredArray,
        category,
        setcategory,
        re,
        setRe,
        TDMode,
        set3dMode,
        renderer,
        setRenderer,
        assetL3doader,
        setasset3dLoader,
        newEditorBox,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GloabalProvider");
  }
  return context;
}
