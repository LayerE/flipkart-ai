import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { fabric } from "fabric";


type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextITFC {
  canvasInstance: React.MutableRefObject<any | null>;
  addimgToCanvas: (url:string) => void;
  getBase64FromUrl: (url:string) => void;

 

  activeTab: number | null;
  setActiveTab: (tabID: number) => void;
  selectedImg: string | null;
  setSelectedImg: (selectedImg: string) => void;

  file: File | null;
  setFile: (file: File | null) => void;


  selectedImage: object;
  setSelectedImage: (selectedImage: object) => void;
  viewMore: object;
  setViewMore: (viewMore: object) => void;

  selectCategory: string;
  setSelectedCategory: (selectCategory: string) => void;
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
  selectRunder: number;
  setSelectedRender: (selectRunder: number) => void;
  selectColoreStrength: number;
  setSelectedColoreStrength: (selectColoreStrength: number) => void;
  selectOutLline: number;
  setSelectedOutline: (selectOutLline: number) => void;
  promt: string;
  setpromt: (promt: string) => void;
  bgpromt: string;
  setBgpromt: (bgpromt: string) => void;
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
  bgRemove: boolean;
  setBgRemove: (bgRemove: boolean) => void;
  magickErase: boolean;
  setMagickErase: (magickErase: boolean) => void;
  upScale: boolean;
  setupscale: (upScale: boolean) => void;
  front: boolean;
  setFront: (front: boolean) => void;
  back: boolean;
  setBack: (back: boolean) => void;
  modifidImage: string;
  setModifidImage: (modifidImage: string) => void;
  uploadedProductlist: string[];
  setUploadedProductlist: (uploadedProductlist: string[]) => void;
  upladedArray: string[];
  setUpladedArray: (upladedArray: string[]) => void;
  modifidImageArray: string[];
  setModifiduploadedProductlist: (modifidImageArray: string[]) => void;
  undoArray: string[];
  setUndoArray: (undoArray: string[]) => void;

  previewLoader: boolean;
  setPriviewLoader: (previewLoader: boolean) => void;
  generationLoader: boolean;
  setGenerationLoader: (generationLoader: boolean) => void;

  inpainting: boolean;
  setInpainting: (inpainting: boolean) => void;
  removeText: boolean;
  setRemoveText: (removeText: boolean) => void;
  replaceBg: boolean;
  setReplaceBg: (replaceBg: boolean) => void;
  PDE: boolean;
  setPDE: (PDE: boolean) => void;
  PSN: boolean;
  setPSN: (PSN: boolean) => void;
  superResolution: boolean;
  setSuperResolution: (superResolution: boolean) => void;
  magicImage: string;
  setMagicImage: (magicImage: string) => void;
}
export const AppContext = createContext<ContextITFC>({
  activeTab: 2,
  setActiveTab: () => {},
  selectedImg: null,
  setSelectedImg: () => {},
  canvasInstance:  null,
  addimgToCanvas: () => {},
  getBase64FromUrl: () => {},


  



  file: null,
  setFile: () => {},

  selectedImage: {},
  setSelectedImage: (selectedImage: Object) => {},
  viewMore: {},
  setViewMore: (viewMore: Object) => {},
  selectCategory: "",
  setSelectedCategory: (selectCategory: string) => {},
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
  selectRunder: 1,
  setSelectedRender: (selectRunder: number) => {},
  selectColoreStrength: 1,
  setSelectedColoreStrength: (selectColoreStrength: number) => {},
  selectOutLline: 1,
  setSelectedOutline: (selectOutLline: number) => {},

  promt: "",
  setpromt: (promt: string) => {},
  bgpromt: "",
  setBgpromt: (promt: string) => {},
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
  bgRemove: false,
  setBgRemove: () => {},
  magickErase: false,
  setMagickErase: () => {},
  upScale: false,
  setupscale: () => {},
  front: true,
  setFront: () => {},
  back: false,
  setBack: () => {},
  modifidImage: "",
  setModifidImage: () => {},

  uploadedProductlist: [],
  setUploadedProductlist: (uploadedProductlist: string[]) => {},
  modifidImageArray: [],
  setModifiduploadedProductlist: (modifidImageArray: string[]) => {},
  upladedArray: [],
  setUpladedArray: (upladedArray: string[]) => {},

  undoArray: [],
  setUndoArray: (undoArray: string[]) => {},

  previewLoader: false,
  setPriviewLoader: () => {},
  generationLoader: false,
  setGenerationLoader: () => {},
  inpainting: false,
  setInpainting: () => {},
  removeText: false,
  setRemoveText: (removeText: boolean) => {},
  replaceBg: false,
  setReplaceBg: () => {},
  PDE: false,
  setPDE: () => {},
  PSN: false,
  setPSN: () => {},
  superResolution: false,
  setSuperResolution: () => {},
  magicImage: "",
  setMagicImage: () => {},
});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const canvasInstance  = useRef(null);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [file, setFile] = useState<File | null>(null);
 
  const [selectedImage, setSelectedImage] = useState<object>({});
  const [viewMore, setViewMore] = useState<object>({});

  const [modifidImage, setModifidImage] = useState<string>("");
  const [modifidImageArray, setModifiduploadedProductlist] = useState<string[]>([]);
  const [upladedArray, setUpladedArray] = useState<string[]>([]);

  const [undoArray, setUndoArray] = useState<string[]>([]);

  const [selectCategory, setSelectedCategory] = useState<string>("");
  const [selectPlacement, setSelectedPlacement] = useState<string>("");
  const [selectSurrounding, setSelectedSurrounding] = useState<string>("");
  const [surroundingtype, setSurroundingtype] = useState<string>("");

  const [selectBackground, setSelectedBackground] = useState<string>("");
  const [selectColoreMode, setSelectedColoreMode] = useState<string>("");
  const [selectResult, setSelectedresult] = useState<number>(0);
  const [selectRunder, setSelectedRender] = useState<number>(0);
  const [selectColoreStrength, setSelectedColoreStrength] = useState<number>(0);
  const [selectOutLline, setSelectedOutline] = useState<number>(0);

  const [promt, setpromt] = useState<string>("");
  const [bgpromt, setBgpromt] = useState<string>("");
  const [magicImage, setMagicImage] = useState<string>("");

  const [product, setProduct] = useState<string>("");
  const [placementTest, setPlacementTest] = useState<string>("");
  const [surroundingTest, setSurroundingTest] = useState<string>("");
  const [backgroundTest, setBackgrundTest] = useState<string>("");

  const [colore, setColore] = useState<string>("");
  const [bgRemove, setBgRemove] = useState<boolean>(false);
  const [magickErase, setMagickErase] = useState<boolean>(false);
  const [upScale, setupscale] = useState<boolean>(false);
  const [front, setFront] = useState<boolean>(false);
  const [back, setBack] = useState<boolean>(false);
  const [uploadedProductlist, setUploadedProductlist] = useState<string[]>([]);

  const [previewLoader, setPriviewLoader] = useState<boolean>(false);
  const [generationLoader, setGenerationLoader] = useState<boolean>(false);

  const [inpainting, setInpainting] = useState<boolean>(false);
  const [removeText, setRemoveText] = useState<boolean>(false);
  const [replaceBg, setReplaceBg] = useState<boolean>(false);
  const [PDE, setPDE] = useState<boolean>(false);
  const [PSN, setPSN] = useState<boolean>(false);
  const [superResolution, setSuperResolution] = useState<boolean>(false);

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const addimgToCanvas = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      img.scaleToWidth(200);
      // img.scaleToHeight(150);
      // Scale the image to have the same width and height as the rectangle
      // const scaleX = downloadRect.width / img.width;
      // const scaleY = downloadRect.height / img.height;

      // Position the image to be in the center of the rectangle
      img.set({
        left: 100,
        top: 200,
        // scaleX: scaleX,
        // scaleY: scaleY,
      });

      canvasInstance.current.add(img);
      canvasInstance.current.renderAll();
    });
  };

  return (
    <AppContext.Provider
      value={{
        canvasInstance,
        addimgToCanvas,
  selectedImg, setSelectedImg,
  getBase64FromUrl,
        activeTab,
        setActiveTab,
        file,
        setFile,
        selectedImage,
        setSelectedImage,
        selectCategory,
        setSelectedCategory,
        selectPlacement,
        setSelectedPlacement,
        selectSurrounding,
        setSelectedSurrounding,
        surroundingtype, setSurroundingtype,
        selectBackground,
        setSelectedBackground,
        selectColoreMode,
        setSelectedColoreMode,
        selectResult,
        setSelectedresult,
        selectRunder,
        setSelectedRender,
        selectColoreStrength,
        setSelectedColoreStrength,
        selectOutLline,
        setSelectedOutline,
        promt,
        setpromt,
        product,
        setProduct,
        placementTest,
        setPlacementTest,
        backgroundTest,
        setBackgrundTest,
        surroundingTest,
        setSurroundingTest,
        colore,
        setColore,
        bgRemove,
        setBgRemove,
        magickErase,
        setMagickErase,
        upScale,
        setupscale,
        front,
        setFront,
        back,
        setBack,
        modifidImage,
        setModifidImage,
        uploadedProductlist,
        setUploadedProductlist,
        previewLoader,
        setPriviewLoader,
        generationLoader,
        setGenerationLoader,
        inpainting,
        setInpainting,
        removeText,
        setRemoveText,
        replaceBg,
        setReplaceBg,
        PDE,
        setPDE,
        PSN,
        setPSN,
        superResolution,
        setSuperResolution,
        bgpromt,
        setBgpromt,
        modifidImageArray,
        setModifiduploadedProductlist,
        upladedArray,
        setUpladedArray,
        undoArray,
        setUndoArray,
        magicImage,
        setMagicImage,
        viewMore,
        setViewMore,
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
