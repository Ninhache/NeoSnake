import React, { ReactNode, createContext, useContext, useState } from "react";
import { Coordinates } from "../../@types/CoordinatesType";
import { foodType, gameObjectType, obstacleType } from "../../@types/MapTypes";
import { Nullable } from "../../@types/NullableType";
import { ScenarioData } from "../../@types/Scenario";

interface ScenarioDataContextProps {
  currentScenario: number;
  currentGameObjectType: Nullable<gameObjectType>;
  latestChanges: Coordinates[];
  mapData: ScenarioData;
  isDrawing: boolean;
  pendingChanges: boolean;
  addFutureFruitPositions: (index: number, newCoordinates: Coordinates) => void;
  addGameFruits: (data: { x: number; y: number; type: foodType }) => void;
  addObstacle: (data: { x: number; y: number; type: obstacleType }) => void;
  addScenario: () => void;
  deleteFutureFruitPositions: (fruitIndex: number, futureIndex: number) => void;
  deleteGameFruits: (index: number) => void;
  deleteObstacle: (data: { x: number; y: number }) => void;
  deleteScenario: (index: number) => void;
  duplicateScenario: (index: number) => void;
  setCurrentScenario: (index: number) => void;
  setDrawing: (value: boolean | ((prev: boolean) => boolean)) => void;
  setGameObjectType: (type: Nullable<gameObjectType>) => void;
  setLatestChanges: (data: Coordinates[]) => void;
  setMapData: (data: ScenarioData) => void;
}

const defaultScenario: ScenarioData = {
  options: {
    width: 800,
    height: 800,
    cellSize: 20,
    name: "Example Scenario",
    difficulty: 3,
  },
  snake: {
    startPosition: { x: 10, y: 10 },
    direction: "Right",
    length: 3,
  },
  maps: [
    {
      fruits: [
        {
          actualPosition: { x: 10, y: 15 },
          futurePosition: [
            { x: 15, y: 10 },
            { x: 15, y: 5 },
          ],
          type: "FBa",
        },
      ],
      obstacles: [],
    },
  ],
};

const EditorContext = createContext<ScenarioDataContextProps>({
  currentScenario: 0,
  currentGameObjectType: null,
  latestChanges: [],
  mapData: defaultScenario,
  isDrawing: false,
  pendingChanges: false,
  addFutureFruitPositions: () => {},
  addGameFruits: () => {},
  addObstacle: () => {},
  addScenario: () => {},
  deleteFutureFruitPositions: () => {},
  deleteGameFruits: () => {},
  deleteObstacle: () => {},
  deleteScenario: () => {},
  duplicateScenario: () => {},
  setCurrentScenario: () => {},
  setDrawing: () => {},
  setGameObjectType: () => {},
  setLatestChanges: () => {},
  setMapData: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

const EditorContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [mapData, setMapData] = useState<ScenarioData>(defaultScenario);
  const [latestChanges, setLatestChanges] = useState<Coordinates[]>([]);
  const [isDrawing, setDrawing] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  const [currentGameObjectType, setGameObjectType] =
    useState<Nullable<gameObjectType>>("FBa");

  const [currentScenario, setCurrentScenario] = useState<number>(0);

  const addGameFruits = ({
    x,
    y,
    type,
  }: {
    x: number;
    y: number;
    type: foodType;
  }) => {
    setPendingChanges(true);
    setLatestChanges((prev) => {
      return [...prev, { x, y }];
    });

    setMapData((prev) => {
      const newFruits = [...prev.maps[currentScenario].fruits];

      newFruits.push({
        actualPosition: { x, y },
        futurePosition: [],
        type,
      });

      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            fruits: newFruits,
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const addFutureFruitPositions = (index: number, { x, y }: Coordinates) => {
    setPendingChanges(true);

    setMapData((prev) => {
      const newPositions = [
        ...prev.maps[currentScenario].fruits[index].futurePosition,
      ];

      newPositions.push({ x, y });

      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            fruits: [
              ...prev.maps[currentScenario].fruits.slice(0, index),
              {
                ...prev.maps[currentScenario].fruits[index],
                futurePosition: newPositions,
              },
              ...prev.maps[currentScenario].fruits.slice(index + 1),
            ],
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const deleteGameFruits = (index: number) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            fruits: [
              ...prev.maps[currentScenario].fruits.slice(0, index),
              ...prev.maps[currentScenario].fruits.slice(index + 1),
            ],
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const deleteFutureFruitPositions = (
    fruitIndex: number,
    futureIndex: number
  ) => {
    setPendingChanges(true);

    setMapData((prev) => {
      const newPositions = [
        ...prev.maps[currentScenario].fruits[fruitIndex].futurePosition,
      ];

      newPositions.splice(futureIndex, 1);

      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            fruits: [
              ...prev.maps[currentScenario].fruits.slice(0, fruitIndex),
              {
                ...prev.maps[currentScenario].fruits[fruitIndex],
                futurePosition: newPositions,
              },
              ...prev.maps[currentScenario].fruits.slice(fruitIndex + 1),
            ],
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const addObstacle = ({
    x,
    y,
    type,
  }: {
    x: number;
    y: number;
    type: obstacleType;
  }) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            obstacles: [
              ...prev.maps[currentScenario].obstacles,
              { x, y, type },
            ],
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const deleteObstacle = ({ x, y }: { x: number; y: number }) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            obstacles: prev.maps[currentScenario].obstacles.filter(
              (obstacle) => obstacle.x !== x || obstacle.y !== y
            ),
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const addScenario = () => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps,
          {
            fruits: [],
            obstacles: [],
          },
        ],
      };
    });
  };

  const duplicateScenario = (index: number) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps,
          {
            ...prev.maps[index],
          },
        ],
      };
    });
  };

  const deleteScenario = (index: number) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [...prev.maps.slice(0, index), ...prev.maps.slice(index + 1)],
      };
    });
  };

  return (
    <EditorContext.Provider
      value={{
        mapData,
        currentScenario,
        currentGameObjectType,
        isDrawing,
        latestChanges,
        setGameObjectType,
        setCurrentScenario,
        setDrawing,
        setLatestChanges,
        setMapData,
        addGameFruits,
        addObstacle,
        deleteObstacle,
        addScenario,
        deleteScenario,
        duplicateScenario,

        addFutureFruitPositions,
        deleteGameFruits,
        deleteFutureFruitPositions,
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
