import { SaveData } from '../types';

const SAVE_KEY = 'pet_whack_a_mole_save';

export class SaveSystem {
  public save(data: SaveData): void {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(SAVE_KEY, json);
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  }

  public load(): SaveData | null {
    try {
      const json = localStorage.getItem(SAVE_KEY);
      if (json) {
        return JSON.parse(json) as SaveData;
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
    return null;
  }

  public clear(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  }

  public exists(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }
}
