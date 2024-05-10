import React, { ReactNode, createContext, useContext, useState } from "react";
import {
  GameObject,
  SnakeMapData,
  gameObjectType,
} from "../../@types/MapTypes";

interface SnakeMapDataContextProps {
  mapData: SnakeMapData;
  currentGameObjectType: gameObjectType;
  setMapData: (data: SnakeMapData) => void;
  addGameObject: (gameObject: GameObject) => void;
  setGameObjectType: (gameObjectType: gameObjectType) => void;
  deleteGameObject(x: number, y: number): void;
  pendingChanges: boolean;
}

const defaultMapData: SnakeMapData = {
  options: {
    width: 800,
    height: 800,
    cellSize: 20,
    name: "Default Map",
  },
  snake: {
    startPosition: { x: 5, y: 5 },
    direction: "Right",
    length: 3,
  },
  gameObject: [],
};

const EditorContext = createContext<SnakeMapDataContextProps>({
  mapData: defaultMapData,
  currentGameObjectType: "FBa",
  setMapData: () => {},
  addGameObject: () => {},
  setGameObjectType: () => {},
  deleteGameObject: () => {},
  pendingChanges: false,
});

interface ProviderProps {
  children: ReactNode;
}

const EditorContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [mapData, setMapData] = useState<SnakeMapData>(defaultMapData);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  const [currentGameObjectType, setGameObjectType] =
    useState<gameObjectType>("FBa");

  const addGameObject = ({ x, y, type }: GameObject) => {
    setPendingChanges(true);
    setMapData((prev) => ({
      ...prev,
      gameObject: [
        ...prev.gameObject.filter((obj) => obj.x !== x || obj.y !== y),
        { x, y, type },
      ],
    }));
  };

  const deleteGameObject = (x: number, y: number) => {
    setPendingChanges(true);
    setMapData((prev) => ({
      ...prev,
      gameObject: prev.gameObject.filter((obj) => obj.x !== x || obj.y !== y),
    }));
  };

  return (
    <EditorContext.Provider
      value={{
        mapData,
        setMapData,
        addGameObject,
        deleteGameObject,
        setGameObjectType,
        currentGameObjectType,
        pendingChanges,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorContextProvider");
  }
  return context;
};

export { EditorContextProvider, useEditor };
