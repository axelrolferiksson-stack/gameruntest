// HealthKit Service for iOS native integration
// This will only work when running as a native iOS app via Capacitor

export interface HealthData {
  steps: number;
  distance: number; // in meters
  activeMinutes: number;
}

class HealthKitService {
  private isNative: boolean = false;

  constructor() {
    // Check if we're running in a Capacitor native environment
    this.isNative = typeof (window as any).Capacitor !== 'undefined';
  }

  async requestAuthorization(): Promise<boolean> {
    if (!this.isNative) {
      console.log('HealthKit is only available on native iOS devices');
      return false;
    }

    // This will be implemented when the native plugin is added
    // For now, return true in dev mode
    console.log('HealthKit authorization would be requested here');
    return true;
  }

  async getTodayData(): Promise<HealthData> {
    if (!this.isNative) {
      // Return mock data for web preview
      return {
        steps: Math.floor(Math.random() * 5000) + 2000,
        distance: Math.floor(Math.random() * 3000) + 1000,
        activeMinutes: Math.floor(Math.random() * 60) + 20,
      };
    }

    // This will be implemented with the native HealthKit plugin
    // For now, return mock data
    return {
      steps: 0,
      distance: 0,
      activeMinutes: 0,
    };
  }

  // Calculate screen time earned based on activity
  calculateScreenTimeEarned(data: HealthData): number {
    // 1 minute of screen time per 100 steps
    const stepsMinutes = Math.floor(data.steps / 100);
    
    // 2 minutes of screen time per active minute
    const activeMinutes = data.activeMinutes * 2;
    
    // 1 minute per 500 meters walked
    const distanceMinutes = Math.floor(data.distance / 500);
    
    return stepsMinutes + activeMinutes + distanceMinutes;
  }

  isAvailable(): boolean {
    return this.isNative;
  }
}

export const healthKitService = new HealthKitService();
