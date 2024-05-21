import React, { createContext, ReactNode, useContext, useState } from "react";
import { Coordinates } from "../../@types/CoordinatesType";
import { foodType, gameObjectType } from "../../@types/MapTypes";
import { Nullable } from "../../@types/NullableType";

import { BaseScenarioData } from "../../@types/scenario/Scenario";
import { ObstacleColor } from "../../classes/Obstacles";

export type DrawingType = "OBSTACLE" | "FRUIT" | "NONE";

interface ScenarioDataContextProps {
  currentScenario: number;
  currentFruitIndex: number;
  currentGameObjectType: Nullable<gameObjectType>;
  currentObstacleColor: ObstacleColor;
  latestChanges: Coordinates[];
  mapData: BaseScenarioData;
  isDrawing: DrawingType;
  pendingChanges: boolean;
  addFutureFruitPositions: (index: number, newCoordinates: Coordinates) => void;
  addGameFruits: (data: { x: number; y: number; type: foodType }) => void;
  addObstacle: (data: { x: number; y: number }) => void;
  addScenario: () => void;
  deleteFutureFruitPositionsByIndex: (
    fruitIndex: number,
    futureIndex: number
  ) => void;
  deleteFutureFruitPositionsByCoordinates: (
    fruitIndex: number,
    data: { x: number; y: number }
  ) => void;
  deleteGameFruits: (index: number) => void;
  deleteObstacle: (data: { x: number; y: number }) => void;
  deleteScenario: (index: number) => void;
  duplicateScenario: (index: number) => void;
  setCurrentScenario: (index: number) => void;
  setCurrentFruitIndex: (index: number | ((prev: number) => number)) => void;
  setDrawing: (
    value: DrawingType | ((prev: DrawingType) => DrawingType)
  ) => void;
  setGameObjectType: (type: Nullable<gameObjectType>) => void;
  setLatestChanges: (data: Coordinates[]) => void;
  setMapData: (data: BaseScenarioData) => void;
  setObstacleColors: (color: ObstacleColor) => void;
  shape: Nullable<"LINE" | "RECTANGLE" | "CIRCLE">;
  selectShape: (
    shape:
      | Nullable<"LINE" | "RECTANGLE" | "CIRCLE">
      | ((
          prev: Nullable<"LINE" | "RECTANGLE" | "CIRCLE">
        ) => Nullable<"LINE" | "RECTANGLE" | "CIRCLE">)
  ) => void;
}

const defaultScenario: BaseScenarioData = {
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
  currentFruitIndex: -1,
  currentGameObjectType: null,
  latestChanges: [],
  mapData: defaultScenario,
  isDrawing: "NONE",
  pendingChanges: false,
  currentObstacleColor: "black",
  addFutureFruitPositions: () => {},
  addGameFruits: () => {},
  addObstacle: () => {},
  addScenario: () => {},
  deleteFutureFruitPositionsByIndex: () => {},
  deleteFutureFruitPositionsByCoordinates: () => {},
  deleteGameFruits: () => {},
  deleteObstacle: () => {},
  deleteScenario: () => {},

  duplicateScenario: () => {},
  setCurrentScenario: () => {},
  setCurrentFruitIndex: () => {},
  setDrawing: () => {},
  setGameObjectType: () => {},
  setLatestChanges: () => {},
  setMapData: () => {},
  setObstacleColors: () => {},
  shape: null,
  selectShape: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

const EditorContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [mapData, setMapData] = useState<BaseScenarioData>(defaultScenario);
  const [latestChanges, setLatestChanges] = useState<Coordinates[]>([]);
  const [isDrawing, setDrawing] = useState<DrawingType>("NONE");
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  const [currentGameObjectType, setGameObjectType] =
    useState<Nullable<gameObjectType>>("FBa");
  const [currentObstacleColor, setObstacleColors] =
    useState<ObstacleColor>("black");

  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [currentFruitIndex, setCurrentFruitIndex] = useState<number>(-1);
  const [shape, selectShape] =
    useState<Nullable<"LINE" | "RECTANGLE" | "CIRCLE">>(null);

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

  const deleteFutureFruitPositionsByCoordinates = (
    fruitIndex: number,
    { x, y }: Coordinates
  ) => {
    setPendingChanges(true);

    setMapData((prev) => {
      const newPositions = [
        ...prev.maps[currentScenario].fruits[fruitIndex].futurePosition,
      ];

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
                futurePosition: newPositions.filter(
                  (position) => position.x !== x || position.y !== y
                ),
              },
              ...prev.maps[currentScenario].fruits.slice(fruitIndex + 1),
            ],
          },
          ...prev.maps.slice(currentScenario + 1),
        ],
      };
    });
  };

  const deleteFutureFruitPositionsByIndex = (
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

  const addObstacle = ({ x, y }: { x: number; y: number }) => {
    setPendingChanges(true);

    setMapData((prev) => {
      return {
        ...prev,
        maps: [
          ...prev.maps.slice(0, currentScenario),
          {
            ...prev.maps[currentScenario],
            obstacles: [
              ...prev.maps[currentScenario].obstacles.filter(
                (obstacle) => obstacle.x !== x || obstacle.y !== y
              ),
              { x, y, color: currentObstacleColor },
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
            fruits: [
              {
                actualPosition: { x: 10, y: 15 },
                futurePosition: [],
                type: "FBa",
              },
            ],
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
        currentFruitIndex,
        currentObstacleColor,
        currentGameObjectType,
        isDrawing,
        latestChanges,
        pendingChanges,
        setGameObjectType,
        setCurrentScenario,
        setCurrentFruitIndex,
        setDrawing,
        setLatestChanges,
        setMapData,
        setObstacleColors,
        addGameFruits,
        addObstacle,
        deleteObstacle,
        addScenario,
        deleteScenario,
        duplicateScenario,
        addFutureFruitPositions,
        deleteGameFruits,
        deleteFutureFruitPositionsByIndex,
        deleteFutureFruitPositionsByCoordinates,
        selectShape,
        shape,
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
