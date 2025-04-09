import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getMonth } from "./getTime";
import { Car } from "./types";


interface UserStore {
  name: string;
  setName: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  userId: number;
  setUserId: (value: number) => void;
  kycStatus: string;
  setKycStatus: (value: string) => void;
  kycStatusFlag: boolean;
  setKycStatusFlag: (value: boolean) => void;
}

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
}

interface SearchStore {
  startDate: Date;
  setStartDate: (value: Date) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

interface FavoriteStore {
  favoriteCars: Car[];
  setFavoriteCars: (value: Car[]) => void;
}

interface CarStore {
  cars: Car[];
  setCars: (value: Car[]) => void;
  isCarLoading:boolean;
  setIsCarLoading: (value: boolean) => void;
}

interface ScreenLoader {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

interface LoginStore {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

interface FilteredCarStore {
  filteredCars: Car[];
  setFilteredCars: (value: Car[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

type ServerStore ={
  isServerLoading: boolean;
  setIsServerLoading: (isServerLoading:boolean) => void;
  isInitiateComplete:boolean;
  setIsInitiateComplete: (isInitiateComplete:boolean) => void;
}

export const useServerStore = create<ServerStore>()(
  devtools(
    persist(
      (set) => ({
        isServerLoading: false,
        setIsServerLoading: (isServerLoading:boolean) => {
          set({ isServerLoading: isServerLoading });
        },
        isInitiateComplete:false,
        setIsInitiateComplete: (isInitiateComplete:boolean) => {
          set({ isInitiateComplete: isInitiateComplete });
        },
      }),
      { name: "server_data", skipHydration: true },
    ),
  ),  
);

export const useLoaderStore = create<ScreenLoader>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,
        setIsLoading: (isLoading:boolean) => {
          set({ isLoading: isLoading });
        }
      }),
      { name: "loading_data", skipHydration: true },
    ),
  ),  
);


export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
      }),
      { name: "date_data", skipHydration: true },
    ),
  ),
);

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        setName: (value: string) => {
          set({ name: value });
        },
        imageUrl: "",
        setImageUrl: (value: string) => {
          set({ imageUrl: value });
        },
        userId: -1,
        setUserId: (value: number) => {
          set({ userId: value });
        },
        kycStatus: "",
        setKycStatus: (value: string) => {
          set({ kycStatus: value });
        },
        kycStatusFlag: false,
        setKycStatusFlag: (value: boolean) => {
          set({ kycStatusFlag: value });
        },
      }),
      { name: "user_data", skipHydration: true },
    ),
  ),
);

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      (set) => ({
        startDate: new Date(),
        setStartDate: (value: Date) => {
          set({ startDate: value });
        },
        endDate: new Date(),
        setEndDate: (value: Date | null) => {
          set({ endDate: value });
        },
        startTime: "8:30 AM",
        setStartTime: (value: string) => {
          set({ startTime: value });
        },
        endTime: "8:30 AM",
        setEndTime: (value: string) => {
          set({ endTime: value });
        },
        isSearching: false,
        setIsSearching: (value: boolean) => {
          set({ isSearching: value });
        },
      }),
      { name: "user_data", skipHydration: true },
    ),
  ),
);

export const useCarStore = create<CarStore>()(
  devtools(
    persist(
      (set) => ({
        cars: [],
        setCars: (value: Car[]) => {
          set({ cars: value });
        },
        isCarLoading:false,
        setIsCarLoading: (value: boolean) => {
          set({ isCarLoading: value });
        },
      }),
      { name: "car_data", skipHydration: true },
    ),
  ),
);

export const useFilteredCarStore = create<FilteredCarStore>()(
  devtools(
    persist(
      (set) => ({
        filteredCars: [],
        setFilteredCars: (value: Car[]) => {
          set({ filteredCars: value });
        },
        isLoading: false,
        setIsLoading: (value: boolean) => {
          set({ isLoading: value });
        },
      }),
      { name: "car_data", skipHydration: true },
    ),
  ),
);

export const useLoginStore = create<LoginStore>()(
  devtools(
    persist(
      (set) => ({
        isSignUp: false,
        setIsSignUp: (value: boolean) => {
          set({ isSignUp: value });
        },
      }),
      { name: "login_data", skipHydration: true },
    ),
  ),
);

export const useFavoriteStore = create<FavoriteStore>()(
  devtools(
    persist(
      (set) => ({
        favoriteCars: [],
        setFavoriteCars: (value: Car[]) => {
          set({ favoriteCars: value });
        },
      }),
      { name: "user_data", skipHydration: true },
    ),
  ),
);




