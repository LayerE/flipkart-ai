import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextITFC {
  activeTab: number | null;
  setActiveTab: (tabID: number) => void;
  file: File | null;
  setFile: (file: File | null) => void;

  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
  selectedImage: object;
  setSelectedImage: (selectedImage: object) => void;
  viewMore: object;
  setViewMore: (viewMore: object) => void;

  selectCategory: string;
  setSelectedCategory: (selectCategory: string) => void;
  selectPlacement: string;
  setSelectedPlacement: (selectPlacement: string) => void;
  selectSurrounding: string;
  setSelectedSurrounding: (selectSurrounding: string) => void;
  selectBackground: string;
  setSelectedBackground: (selectBackground: string) => void;
  selectColore: string;
  setSelectedColore: (selectColore: string) => void;
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
  imageArray: string[];
  setImageArray: (imageArray: string[]) => void;
  upladedArray: string[];
  setUpladedArray: (upladedArray: string[]) => void;
  modifidImageArray: string[];
  setModifidImageArray: (modifidImageArray: string[]) => void;
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
  file: null,
  setFile: () => {},
  selectedOption: "",
  setSelectedOption: (selectedOption: string) => {},
  selectedImage: {},
  setSelectedImage: (selectedImage: Object) => {},
  viewMore: {},
  setViewMore: (viewMore: Object) => {},
  selectCategory: "",
  setSelectedCategory: (selectCategory: string) => {},
  selectPlacement: "",
  setSelectedPlacement: (selectPlacement: string) => {},
  selectSurrounding: "",
  setSelectedSurrounding: (selectSurrounding: string) => {},
  selectBackground: "",
  setSelectedBackground: (selectBackground: string) => {},
  selectColore: "",
  setSelectedColore: (selectColore: string) => {},
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

  imageArray: [],
  setImageArray: (imageArray: string[]) => {},
  modifidImageArray: [],
  setModifidImageArray: (modifidImageArray: string[]) => {},
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
  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [file, setFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<object>({});
  const [viewMore, setViewMore] = useState<object>({});

  const [modifidImage, setModifidImage] = useState<string>("");
  const [modifidImageArray, setModifidImageArray] = useState<string[]>([]);
  const [upladedArray, setUpladedArray] = useState<string[]>([]);

  const [undoArray, setUndoArray] = useState<string[]>([]);

  const [selectCategory, setSelectedCategory] = useState<string>("");
  const [selectPlacement, setSelectedPlacement] = useState<string>("");
  const [selectSurrounding, setSelectedSurrounding] = useState<string>("");
  const [selectBackground, setSelectedBackground] = useState<string>("");
  const [selectColore, setSelectedColore] = useState<string>("");
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
  const [imageArray, setImageArray] = useState<string[]>([]);

  const [previewLoader, setPriviewLoader] = useState<boolean>(false);
  const [generationLoader, setGenerationLoader] = useState<boolean>(false);

  const [inpainting, setInpainting] = useState<boolean>(false);
  const [removeText, setRemoveText] = useState<boolean>(false);
  const [replaceBg, setReplaceBg] = useState<boolean>(false);
  const [PDE, setPDE] = useState<boolean>(false);
  const [PSN, setPSN] = useState<boolean>(false);
  const [superResolution, setSuperResolution] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        file,
        setFile,
        selectedOption,
        setSelectedOption,
        selectedImage,
        setSelectedImage,
        selectCategory,
        setSelectedCategory,
        selectPlacement,
        setSelectedPlacement,
        selectSurrounding,
        setSelectedSurrounding,
        selectBackground,
        setSelectedBackground,
        selectColore,
        setSelectedColore,
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
        imageArray,
        setImageArray,
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
        setModifidImageArray,
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
