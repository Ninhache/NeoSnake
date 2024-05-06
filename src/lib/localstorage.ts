/**
 * This function is used to save the highest level reached by the player
 * This is used to save the progress of the player
 *
 * @param level the level to save
 */
export const saveLevelProgress = (level: number) => {
  localStorage.setItem("highestLevelReached", level.toString());
};

/**
 * @returns the highest level reached by the player
 * If the player has not played the game yet, it will return 1
 */
export const loadLevelProgress = (): number => {
  const highestLevelCompleted = localStorage.getItem("highestLevelReached");
  return highestLevelCompleted ? parseInt(highestLevelCompleted) : 1;
};

/**
 * This function is used to clear the local storage used by the domain
 * This is used to reset the game progress
 */
export const clearCache = () => {
  // If I need to clear all local storage used by the domain
  // localStorage.clear();
  localStorage.removeItem("highestLevelReached");

  // reload the page to reflect the changes
  window.location.reload();
};

/**
 * This function is used to set the highest level reached to 9999
 * This is used to test the game without having to play all the levels
 */
export const godCache = () => {
  saveLevelProgress(9999);
  window.location.reload();
};
