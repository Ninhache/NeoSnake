/**
 * Util function to check if an element is visible in the viewport
 *
 * @param elem
 * @returns
 */
export const isVisible = (elem: HTMLElement): boolean => {
  const rect = elem.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
