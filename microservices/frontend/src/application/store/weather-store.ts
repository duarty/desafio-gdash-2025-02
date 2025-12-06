import { create } from "zustand";

interface CurrentWeather {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
}

interface WeatherState {
    currentWeather: CurrentWeather | null;
    setCurrentWeather: (weather: CurrentWeather | null) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
    currentWeather: null,
    setCurrentWeather: (currentWeather) => set({ currentWeather }),
}));
