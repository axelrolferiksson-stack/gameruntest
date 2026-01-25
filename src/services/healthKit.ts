// HealthKit Service for iOS native integration
// Uses @perfood/capacitor-healthkit plugin for real device data

export interface HealthData {
  steps: number;
  distance: number; // in meters
  activeMinutes: number;
}

// Sample names for querying HealthKit
const READ_PERMISSIONS = ['steps', 'distance', 'duration'];

class HealthKitService {
  private isNative: boolean = false;
  private plugin: any = null;

  constructor() {
    // Check if we're running in a Capacitor native environment
    this.isNative = typeof (window as any).Capacitor !== 'undefined';
    this.initPlugin();
  }

  private async initPlugin() {
    if (this.isNative) {
      try {
        // Dynamic import to avoid issues in web environment
        const { CapacitorHealthkit } = await import('@perfood/capacitor-healthkit');
        this.plugin = CapacitorHealthkit;
      } catch (error) {
        console.log('HealthKit plugin not available:', error);
        this.plugin = null;
      }
    }
  }

  async requestAuthorization(): Promise<boolean> {
    if (!this.isNative) {
      console.log('HealthKit is only available on native iOS devices');
      // Return true for web preview so users can test the UI
      return true;
    }

    try {
      // Ensure plugin is initialized
      if (!this.plugin) {
        await this.initPlugin();
      }

      if (!this.plugin) {
        console.log('HealthKit plugin could not be loaded');
        return false;
      }

      await this.plugin.requestAuthorization({
        all: [],
        read: READ_PERMISSIONS,
        write: [],
      });

      console.log('HealthKit authorization granted');
      return true;
    } catch (error) {
      console.error('HealthKit authorization error:', error);
      return false;
    }
  }

  async getTodayData(): Promise<HealthData> {
    if (!this.isNative || !this.plugin) {
      // Return mock data for web preview
      return {
        steps: Math.floor(Math.random() * 5000) + 2000,
        distance: Math.floor(Math.random() * 3000) + 1000,
        activeMinutes: Math.floor(Math.random() * 60) + 20,
      };
    }

    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const queryOptions = {
        startDate: startOfDay.toISOString(),
        endDate: now.toISOString(),
        limit: 0, // No limit
      };

      // Query steps
      const stepsResult = await this.plugin.queryHKitSampleType({
        ...queryOptions,
        sampleName: 'stepCount',
      });

      // Query distance (walking + running)
      const distanceResult = await this.plugin.queryHKitSampleType({
        ...queryOptions,
        sampleName: 'distanceWalkingRunning',
      });

      // Query exercise time
      const exerciseResult = await this.plugin.queryHKitSampleType({
        ...queryOptions,
        sampleName: 'appleExerciseTime',
      });

      // Sum up the results
      const steps = this.sumQuantity(stepsResult?.resultData);
      const distance = this.sumQuantity(distanceResult?.resultData);
      const activeMinutes = this.sumQuantity(exerciseResult?.resultData);

      return {
        steps: Math.round(steps),
        distance: Math.round(distance), // in meters
        activeMinutes: Math.round(activeMinutes),
      };
    } catch (error) {
      console.error('Error fetching HealthKit data:', error);
      return {
        steps: 0,
        distance: 0,
        activeMinutes: 0,
      };
    }
  }

  async getDistanceSince(startDate: Date): Promise<number> {
    if (!this.isNative || !this.plugin) {
      // Return mock data for web preview - simulate walking
      const elapsedSeconds = (Date.now() - startDate.getTime()) / 1000;
      // Simulate ~1.5 m/s walking speed with some randomness
      return Math.floor(elapsedSeconds * 1.5 * (0.8 + Math.random() * 0.4));
    }

    try {
      const distanceResult = await this.plugin.queryHKitSampleType({
        sampleName: 'distanceWalkingRunning',
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        limit: 0,
      });

      return Math.round(this.sumQuantity(distanceResult?.resultData));
    } catch (error) {
      console.error('Error fetching distance:', error);
      return 0;
    }
  }

  private sumQuantity(data: any[] | undefined): number {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((sum, item) => {
      const value = item.quantity || item.value || 0;
      return sum + value;
    }, 0);
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
