import type { Timestamp } from "firebase/firestore";

export interface ANote {
    title: string;
    content: string;
    noteDate: Timestamp;
    categoryId: string | null;
}