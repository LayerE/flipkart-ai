import { createContext, useContext, useState, useRef } from "react";
import { fabric } from "fabric";

type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextITFC {
  canvasInstance: React.MutableRefObject<any | null>;
  outerDivRef: React.MutableRefObject<any | null>;
  addimgToCanvas: (url: string) => void;
  addimgToCanvasSubject: (url: string) => void;


  
  getBase64FromUrl: (url: string) => void;
  activeTab: number | null;
  setActiveTab: (tabID: number) => void;
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
  popup: object;
  setPopup: (popup: object) => void;

}
export const AppContext = createContext<ContextITFC>({
  activeTab: 1,
  setActiveTab: () => {},
  selectedImg: null,
  setSelectedImg: () => {},

  downloadImg: null,
  setDownloadImg: () => {},
  isMagic: null,
  setIsMagic: () => {},

  canvasInstance: null,
  outerDivRef: null,
  addimgToCanvas: () => {},
  addimgToCanvasSubject: () => {},


  
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
  popup: {},
  setPopup: () => {},


});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const canvasInstance = useRef(null);
  const outerDivRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState<object | null>(null);
  const [downloadImg, setDownloadImg] = useState<string | null>(null);
  const [isMagic, setIsMagic] = useState<boolean | null>(false);

  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [file, setFile] = useState<File | null>(null);
  const [viewMore, setViewMore] = useState<object>({});
  const [selectPlacement, setSelectedPlacement] = useState<string>("");
  const [selectSurrounding, setSelectedSurrounding] = useState<string>("");
  const [surroundingtype, setSurroundingtype] = useState<string>("");
  const [selectBackground, setSelectedBackground] = useState<string>("");
  const [selectColoreMode, setSelectedColoreMode] = useState<string>("");
  const [selectResult, setSelectedresult] = useState<number>(0);
  const [selectRender, setSelectedRender] = useState<number>(0);
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

  const [popup, setPopup] = useState<object>({});
  const [generatedImgList, setGeneratedImgList] = useState<string[]>([]);


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
      img.set("category", "mask");


      canvasInstance.current.add(img);
      canvasInstance.current.renderAll();
    });
  };
  const addimgToCanvasSubject = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      img.scaleToWidth(200);
      const canvasWidth =  canvasInstance.current.getWidth();
      const canvasHeight =  canvasInstance.current.getHeight();
      const imageAspectRatio = img.width / img.height;

        // Calculate the maximum width and height based on the canvas size
        const maxWidth = canvasWidth;
        const maxHeight = canvasHeight;

          // Calculate the scaled width and height while maintaining the aspect ratio
          let scaledWidth = maxWidth;
          let scaledHeight = scaledWidth / imageAspectRatio;
  
          // If the scaled height exceeds the canvas height, scale it down
          if (scaledHeight > maxHeight) {
            scaledHeight = maxHeight;
            scaledWidth = scaledHeight * imageAspectRatio;
          }

          img.scaleToWidth(scaledWidth);
          img.scaleToHeight(scaledHeight);
      // img.scaleToHeight(150);
      // Scale the image to have the same width and height as the rectangle
      // const scaleX = downloadRect.width / img.width;
      // const scaleY = downloadRect.height / img.height;
      // Position the image to be in the center of the rectangle
      // img.set({
      //   left: 100,
      //   top: 200,
      //   // scaleX: scaleX,
      //   // scaleY: scaleY,
      // });
      img.set("category", "subject");
      canvasInstance.current.clear();
      canvasInstance.current.add(img);
      canvasInstance.current.setActiveObject(img);
      canvasInstance.current.renderAll();
    });
  };

  return (
    <AppContext.Provider
      value={{
        canvasInstance,
        outerDivRef,
        addimgToCanvas,
        addimgToCanvasSubject,
        selectedImg,
        setSelectedImg,
        getBase64FromUrl,
        activeTab,
        setActiveTab,
        file,
        setFile,
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
        setBackgrundTest,
        surroundingTest,
        setSurroundingTest,
        colore,
        setColore,
        uploadedProductlist,
        setUploadedProductlist,
        previewLoader,
        setPriviewLoader,
        generationLoader,
        setGenerationLoader,
        viewMore,
        setViewMore,
        isMagic,
        setIsMagic,
        downloadImg,
        setDownloadImg,
  popup, setPopup,
  generatedImgList, setGeneratedImgList


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
