import dayjs from "dayjs";

export type Car = {
  id: number;
  brand: string;
  model: string;
  price: number;
  seats:number;
  fuel:string;
  favorite:boolean;
  photos:string[];
  gear:string;
};

export type CalendarEventType = {
    id: string;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    status: string;
    startTime: string;
    endTime: string;
    color: string;
    allDay: boolean;
    customerName: string;
    customerContact: string;
    carId: number;
    carName: string;
    isAdmin: boolean;
  };