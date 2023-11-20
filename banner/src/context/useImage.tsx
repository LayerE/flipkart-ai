// @ts-nocheck


import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

type ImageObject = {
  id: number;
  modified_image_url: string;
};



// Define the types for your context
type FetchedImagesContextType = {
  contextImages: ImageObject[];
  setContextImages: React.Dispatch<React.SetStateAction<ImageObject[]>>;
  commonPushImageObject: (imageUrl: string) => void; // Add this function
};

const initialContextValue: FetchedImagesContextType = {
  contextImages: [],
  setContextImages: () => {},
  commonPushImageObject: () => {}, // Initialize the function
};

const FetchedImagesContext = createContext<FetchedImagesContextType>(initialContextValue);

export function useImage() {
  return useContext(FetchedImagesContext);
}

export function ImageProvider({ children }: { children: ReactNode }) {
  const [contextImages, setContextImages] = useState<ImageObject[]>([]);

  const commonPushImageObject = (imageUrl: string) => {
    // Implement your logic for commonPushImageObject here
    // You can update contextImages as needed
    // For example, add the new image to contextImages
    const newImage = {
      id: Date.now(), // Use a unique ID
      modified_image_url: imageUrl,
    };
    setContextImages((prevImages) => [...prevImages, newImage]);
  };

  const contextValue: FetchedImagesContextType = {
    contextImages,
    setContextImages,
    commonPushImageObject, // Add the function to the context
  };

  return (
    <FetchedImagesContext.Provider value={contextValue}>
      {children}
    </FetchedImagesContext.Provider>
  );
}
