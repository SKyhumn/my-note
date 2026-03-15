import type { Timestamp } from "firebase/firestore";

export interface NoteSummary{
    id:string
    title:string;
    noteDate:Timestamp;
}