export {};

declare global {
  interface Window {
    secretMode: boolean;
    switchSecretMode: () => void;
  }
}
