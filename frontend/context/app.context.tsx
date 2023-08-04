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
  activeTab: number;
  setActiveTab: (tabID: number) => void;
  file: File | null;
  setFile: (file: File | null) => void;

  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
  selectedImage: object;
  setSelectedImage: (selectedImage: object) => void;
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
}
export const AppContext = createContext<ContextITFC>({
  activeTab: 1,
  setActiveTab: () => {},
  file: null,
  setFile: () => {},
  selectedOption: "",
  setSelectedOption: (selectedOption: string) => {},
  selectedImage: {},
  setSelectedImage: (selectedImage: Object) => {},
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

});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<object>({});
  const [selectCategory, setSelectedCategory] = useState<string>("");
  const [selectPlacement, setSelectedPlacement] = useState<string>("");
  const [selectSurrounding, setSelectedSurrounding] = useState<string>("");
  const [selectBackground, setSelectedBackground] = useState<string>("");
  const [selectColore, setSelectedColore] = useState<string>("");
  const [selectResult, setSelectedresult] = useState<number>(0);
  const [selectRunder, setSelectedRender] = useState<number>(0);
  const [selectColoreStrength, setSelectedColoreStrength] = useState<number>(0);
  const [selectOutLline, setSelectedOutline] = useState<number>(0);


  useEffect(() => {
    // if (window?.localStorage?.getItem("banner_clicked")) {
    //   close("banner");
    // } else {
    //   open("banner");
    // }
  }, []);

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
        setSelectedColore,selectResult, setSelectedresult,
        selectRunder, setSelectedRender,
        selectColoreStrength, setSelectedColoreStrength,
        selectOutLline, setSelectedOutline
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
