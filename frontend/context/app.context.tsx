import { createContext, useContext, useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import { useAuth } from "@clerk/nextjs";
import { saveAs } from "file-saver";
import axios from "axios";

type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextITFC {
  canvasInstance: React.MutableRefObject<any | null>;
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

  canvasInstance: null,
  outerDivRef: null,
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
});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const canvasInstance = useRef(null);

  const outerDivRef = useRef(null);

  const [selectedImg, setSelectedImg] = useState<object | null>(null);
  const [downloadImg, setDownloadImg] = useState<string | null>(null);
  const [isMagic, setIsMagic] = useState<boolean | null>(false);

  const [activeTab, setActiveTab] = useState<number | null>(1);
  const [activeTabHome, setActiveTabHome] = useState<number | null>(1);

  const [file, setFile] = useState<File | null>(null);
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
  const [promtFull, setpromtFull] = useState();


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

  const [undoArray, setUndoArray] = useState<string[]>([]);
  const [editorBox, setEditorBox] = useState<fabric.Rect | null>(null);

  const [popup, setPopup] = useState<object>({});
  const [popupImage, setPopupImage] = useState<object>({});
  const [regeneratePopup, setRegeneratePopup] = useState<object>({});
  const [projectlist, setprojectlist] = useState<object[]>([]);
  const [project, setproject] = useState<object[]>([]);

  const [generatedImgList, setGeneratedImgList] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string[]>([]);
  const PosisionbtnRef = useRef(null);
  const regenerateRef = useRef(null);
  const generateBox = useRef(null);
  const previewBox = useRef(null);
  const [regenratedImgsJobId, setRegenratedImgsJobid] = useState(null);

  const [projectId, setprojectId] = useState(null);
  const [uerId, setUserId] = useState(null);
  const [listofassets, setListOfAssets] = useState(null);
  const [newassetonCanvas, setNewassetonCanvas] = useState(null);

  const [genRect, setgenRect] = useState();

  const canvasHistory = useRef([]);
  const currentCanvasIndex = useRef(-1);
  const canvasRef = useRef(null);

  const [btnVisible, setBtnVisible] = useState(false);
  const handileDownload = (url: string) => {
    saveAs(url, `image${Date.now()}.png`);
  };

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

  const addEditorBoxToCanvas = () => {
    if (canvasInstance?.current && editorBox) {
      canvasInstance?.current.add(editorBox);
      canvasInstance?.current.renderAll();
    }
  };

  // useEffect(() => {
  //   if (!canvasInstance.current) {
  //     canvasInstance.current = new fabric.Canvas(canvasRef.current, {
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //       // transparentCorners: false,
  //       // originX: "center",
  //       // originY: "center",
  //     });
  //   }

  //   // Resize canvas when the window is resized
  //   window.addEventListener("resize", () => {
  //     canvasInstance.current.setDimensions({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   });
  //   return () => {
  //     window.removeEventListener("resize", null);
  //     // Clean up resources (if needed) when the component unmounts
  //     //  canvasInstanceRef.dispose();
  //   };
  // }, []);

  const addimgToCanvas = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      img.scaleToWidth(150);
      // img.scaleToHeight(150);
      // Scale the image to have the same width and height as the rectangle
      // const scaleX = downloadRect.width / img.width;
      // const scaleY = downloadRect.height / img.height;
      // Position the image to be in the center of the rectangle
      const getRandomPosition = (max) => Math.floor(Math.random() * max);
      const randomLeft = getRandomPosition(
        canvasInstance?.current.width / 2 - img.width
      );
      const randomTop = getRandomPosition(
        canvasInstance?.current.height - img.height
      );
      img.set({
        left: randomLeft,
        top: randomTop,
        // scaleX: scaleX,
        // scaleY: scaleY,
      });
      img.on("moving", () => {
        positionBtn(img);
      });
      img.on("scaling", function () {
        positionBtn(img);
      });
      img.set("category", "mask");

      canvasInstance?.current.add(img);
      canvasInstance?.current.renderAll();
      saveCanvasState();
      saveCanvasToDatabase();
    });
  };
  const addimgToCanvasSubject = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions

      img.scaleToWidth(200);
      const canvasWidth = 360;
      const canvasHeight = 400;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;
      const getRandomPosition = (max) => Math.floor(Math.random() * max);

      const randomLeft = getRandomPosition(
        canvasInstance?.current?.width / 2 - img.width
      );
      const randomTop = getRandomPosition(300);
      img.set({
        left: randomLeft,
        top: randomTop,
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

      img.scaleToWidth(200);
      img.scaleToHeight(250);
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
      img.on("mouse:down", () => {
        positionBtn(img);
        // RegeneratepositionBtn(img);
      });

      img.on("moving", () => {
        positionBtn(img);
        // RegeneratepositionBtn(img);
      });
      // img.on("scaling", function () {
      //   positionBtn(img);
      // });

      // img.on("mouseover", () => {
      //   // regenerateRef.current.style.display = 'block';
      //   setBtnVisible(true);
      // });

      // Hide the button when moving the mouse away from the image
      // img.on("mouseout", (e) => {
      //   // regenerateRef.current.style.display = 'none';
      //   if (
      //     e.e.clientX > regenerateRef.left ||
      //     e.e.clientX < regenerateRef.left + regenerateRef.width ||
      //     e.e.clientY > regenerateRef.top ||
      //     e.e.clientY < regenerateRef.bottom
      //   ) {
      //     setBtnVisible(false);
      //   } else {
      //     setBtnVisible(true);
      //   }
      // });
      img.set({ category: "subject" });
      // canvasInstance.current.clear();
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

  function positionBtn(obj) {
    const btn = PosisionbtnRef.current;
    const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
    btn.style.left = absCoords.left + "px";
    btn.style.top = absCoords.top + "px";
  }

  function RegeneratepositionBtn(obj) {
    const btns = regenerateRef.current;
    const absCoords = canvasInstance?.current.getAbsoluteCoords(obj);
    btns.style.left = absCoords.left + 150 + "px";
    btns.style.top = absCoords.top + 330 + "px";
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
      console.log("sdsdfs,", userId, projectId, canvasData, "dsffff");
      console.log(canvasData);


      SaveProjexts(userId, projectId, canvasData);
      const filteredResult = generatedImgList.filter((obj) =>
        jobId?.includes(obj?.task_id)
      );
    }
  };
  const GetProjextById = (getUser: string) => {
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
  const SaveProjexts = async (userId, projectId, canvas) => {
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

      if (data && filteredResult[0]?.modified_image_url) {
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
              img: filteredResult[0].modified_image_url,
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

  const renameProject = async (userId, projectId, name) => {
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
      const canvasWidth = 380;
      const canvasHeight = 380;
      const imageAspectRatio = img.width / img.height;

      // Calculate the maximum width and height based on the canvas size
      const maxWidth = canvasWidth;
      const maxHeight = canvasHeight;

      // Calculate the scaled width and height while maintaining the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / imageAspectRatio;

      // If the scaled height exceeds the canvas height, scale it down
      // if (scaledHeight > maxHeight) {
      //   scaledHeight = maxHeight;
      //   scaledWidth = scaledHeight * imageAspectRatio;
      // }

      img.on("mouse:down", () => {
        positionBtn(img);
        RegeneratepositionBtn(img);
      });

      img.on("moving", () => {
        positionBtn(img);
        RegeneratepositionBtn(img);
      });

      // img.on("scaling", function () {
      //   positionBtn(img);
      //   // RegeneratepositionBtn(img);
      // });

      // img.on("mouseover", () => {
      //   RegeneratepositionBtn(img);

      //   // regenerateRef.current.style.display = 'block';
      //   setBtnVisible(true);
      // });

      // // Hide the button when moving the mouse away from the image
      // img.on("mouseout", (e) => {
      //   // regenerateRef.current.style.display = 'none';
      //   if (
      //     e.e.clientX < regenerateRef.left ||
      //     e.e.clientX > regenerateRef.left + regenerateRef.width ||
      //     e.e.clientY < regenerateRef.top ||
      //     e.e.clientY > regenerateRef.bottom
      //   ) {
      //     setBtnVisible(false);
      //   }
      // });

      img.scaleToWidth(scaledWidth);
      img.scaleToHeight(scaledHeight);
      // Set the position of the image
      img.set({
        left: 430,
        top: 120,

        // scaleX: scaleX,
        // scaleY: scaleY,
      });
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
  const { userId } = useAuth();

  useEffect(() => {
    const getUser =
      typeof window === "undefined" ? false : localStorage.getItem("userId");

    setInterval(() => {

    
      fetchGeneratedImages(getUser);
    }, 3000);
  }, []);

  const fetchGeneratedImages = async (userId) => {
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

      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchAssetsImages = async (userId, pro) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/assets?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log(await data);

      if (data?.length) {
        setListOfAssets(await data);
      }

      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  const fetchAssetsImagesWithProjectId = async (userId, pro) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/assets?userId=${userId}&projectId=${pro}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("cdcdcvdcvc", await data);

      if (data?.length) {
        setListOfAssets(await data);
      }

      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const addtoRecntly = async (ueserId, proid, obj) => {
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

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
      // console.log(await response.json(), "dfvcvdfvdvcdsd");
      const datares = await response;

      if (datares.ok) {
        GetProjextById(id);
        // setfilterRecently(project?.recently.reverse())
      }
      // window.open(`/generate/${datares?._id}`, "_self");
    } catch (error) {
      // Handle error
    }
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
      alert("Please select an object on the canvas first.");
      return;
    }
    console.log(activeObject);
    canvasInstance.current.sendBackwards(activeObject);
    canvasInstance.current.discardActiveObject();
    // canvas.requestRenderAll();
    canvasInstance.current.renderAll();
  };

  const generateImageHandeler = async (ueserId, proid) => {
    // console.log(promt);
    setLoader(true);
    setGenerationLoader(true);
    const canvas1 = canvasInstance.current;
    try {
      const genBox = generateBox.current;
      const preBox = previewBox.current;

      addtoRecntly(ueserId, proid);
      // canvas1.set({
      //   left: 30,
      //   top:200
      // });
      // canvas1.renderAll();
      console.log(canvas1);

      // selectedImg // img url to generate images for the canvas

      const objects = canvas1.getObjects();

      const maskObjects = [];
      const subjectObjects = [];
      objects.forEach((object) => {
        // If the object is a mask, add it to the mask objects array
        if (object.category === "mask") {
          maskObjects.push(object);
        }
        // If the object is a subject, add it to the subject objects array
        if (object.category === "subject") {
          subjectObjects.push(object);
        }
      });

      // Make image with only the mask objects
      const maskCanvas = new fabric.Canvas(null, {
        // width: genRect.width,
        // height: genRect.height,
        // top: genRect.height,
        // left: genRect.height,
        left: parseInt(genBox.style.left),
        top: parseInt(genBox.style.top),
        width: parseInt(genBox.style.width),
        height: parseInt(genBox.style.height),
      });

      maskObjects.forEach((object) => {
        // You can adjust the object's position relative to the canvas as needed
        object.set({
          left: object.left - parseInt(genBox.style.left),
          top: object.top - parseInt(genBox.style.top),
        });
        maskCanvas.add(object);
      });
      const maskDataUrl = maskCanvas.toDataURL("image/png");

      console.log("mask", maskDataUrl);

      // Make image with only the subject objects
      const subjectCanvas = new fabric.Canvas(null, {
        // width: genRect.width,
        // height: genRect.height,
        // top: genRect.height,
        // left: genRect.height,
        left: parseInt(genBox.style.left),
        top: parseInt(genBox.style.top),
        width: parseInt(genBox.style.width),
        height: parseInt(genBox.style.height),
      });

      subjectObjects.forEach((object) => {
        object.set({
          left: object.left - parseInt(genBox.style.left),
          top: object.top - parseInt(genBox.style.top),
        });
        subjectCanvas.add(object);
      });

      const subjectDataUrl = subjectCanvas.toDataURL("image/png");
      console.log("subect", subjectDataUrl);

      maskObjects.forEach((object) => {
        // You can adjust the object's position relative to the canvas as needed
        object.set({
          left: object.left + parseInt(genBox.style.left),
          top: object.top + parseInt(genBox.style.top),
        });
      });
      subjectObjects.forEach((object) => {
        object.set({
          left: object.left + parseInt(genBox.style.left),
          top: object.top + parseInt(genBox.style.top),
        });
      });

      const promtText =promtFull
        // product +
        // ", " +
        // selectPlacement +
        // " " +
        // placementTest +
        // ", " +
        // selectSurrounding +
        // " " +
        // surroundingTest +
        // ", " +
        // selectBackground +
        // " " +
        // backgroundTest;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUrl: subjectDataUrl,
          maskDataUrl: maskDataUrl,
          prompt: promtText.trim(),
          user_id: userId,
          lora_type: loara,
          num_images: selectResult,
        }),
      });

      const generate_response = await response.json();

      if (generate_response?.error) {
        alert(generate_response?.error);
        setLoader(false);

        return false;
      } else {
        try {
          setSelectedresult(1);

          // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/jobId`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: ueserId,
              projectId: proid,
              jobId: generate_response?.job_id,
            }),
          });
          // console.log(await response.json(), "dfvcvdfvdvcdsd");
          const datares = await response;

          if (datares.ok) {
            setJobId((pre) => [...pre, generate_response?.job_id]);
            // setRegenratedImgsJobid(generate_response?.job_id);
            // localStorage.setItem("jobId", jobId);

            GetProjextById(proid);
          }
          // window.open(`/generate/${datares?._id}`, "_self");
        } catch (error) {
          // Handle error
        }
      }

      setTimeout(async function () {
        const loadeImge = await fetchGeneratedImages();

        setSelectedImg({
          status: true,
          image: loadeImge[0]?.modified_image_url,
          modifiedImage: loadeImge[0]?.modified_image_url,
        });

        setModifidImageArray((pre) => [
          ...pre,
          { url: loadeImge[0]?.modified_image_url, tool: "generated" },
        ]);

        addimgToCanvasGen(loadeImge[0]?.modified_image_url);
        // canvas1.remove(editorBox).renderAll();

        setGeneratedImgList(loadeImge.slice(0, 20));

        // setSelectedresult(1);

        setLoader(false);
      }, 30000);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
      // canvas1.set({
      //   top: 0,
      //   left: 0
      // });
      // canvas1.renderAll();
    }
  };

  const [reloder, setreLoader] = useState(true);

  // regenrate
  const RegenerateImageHandeler = async (ueserId, proid , img) => {
    // console.log(promt);
    setLoader(true);
    setGenerationLoader(true);
    try {
      setreLoader(true);

      const promtText = promtFull
      console.log(promtText,"dfd");
        // product +
        // ", " +
        // selectPlacement +
        // " " +
        // placementTest +
        // ", " +
        // selectSurrounding +
        // " " +
        // surroundingTest +
        // ", " +
        // selectBackground +
        // " " +
        // backgroundTest;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUrl: img,
          maskDataUrl: null,
          prompt: promtText? promtText : " " + "make minor changes on his image",
          user_id: ueserId,
          // lora_type: loara,
          num_images: 3,
        }),
      });
      
      
      const generate_response = await response.json();
      
      console.log(generate_response);
      if (generate_response?.error) {
        alert(generate_response?.error);
        setLoader(false);
        setreLoader(false);

        return false;
      } else {
        try {
          // setSelectedresult(1);
          setreLoader(false);

          // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

          // const response = await fetch(`${process.env.NEXT_PUBLIC_API}/jobId`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     userId: ueserId,
          //     projectId: proid,
          //     jobId: generate_response?.job_id,
          //   }),
          // });
          // // // console.log(await response.json(), "dfvcvdfvdvcdsd");
          // const datares = await response;
          // setreLoader(false);

          // if (datares.ok) {
          // setJobId((pre) => [...pre, generate_response?.job_id]);
          setRegenratedImgsJobid(generate_response?.job_id);
          // localStorage.setItem("jobId", jobId);

          // GetProjextById(proid);
          // }
          // window.open(`/generate/${datares?._id}`, "_self");
        } catch (error) {
          // Handle error

          setreLoader(false);
        }
      }

      setTimeout(async function () {
        const loadeImge = await fetchGeneratedImages();

        setSelectedImg({
          status: true,
          image: loadeImge[0]?.modified_image_url,
          modifiedImage: loadeImge[0]?.modified_image_url,
        });

        setModifidImageArray((pre) => [
          ...pre,
          { url: loadeImge[0]?.modified_image_url, tool: "generated" },
        ]);

        addimgToCanvasGen(loadeImge[0]?.modified_image_url);
        // canvas1.remove(editorBox).renderAll();

        setGeneratedImgList(loadeImge.slice(0, 20));

        setSelectedresult(1);

        setLoader(false);
      }, 30000);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
      // canvas1.set({
      //   top: 0,
      //   left: 0
      // });
      // canvas1.renderAll();
    }
  };

  // regenrtate

  const [loadercarna, setloadercarna] = useState(false);

  return (
    <AppContext.Provider
      value={{
        loadercarna,
        setloadercarna,
        previewBox,
        loara,
        setLoara,
       promtFull, setpromtFull,
        GetProjexts,
        canvasRef,
        projectId,
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
        setDownloadImg,
        popup,
        setPopup,
        generatedImgList,
        setGeneratedImgList,
        loader,
        setLoader,
        positionBtn,
        promt,
        setpromt,
        undoArray,
        setUndoArray,
        modifidImageArray,
        setModifidImageArray,
        fetchAssetsImagesWithProjectId,
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
