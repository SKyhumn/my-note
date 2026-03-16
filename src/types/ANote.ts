import type { Timestamp } from "firebase/firestore";

export interface ANote {
    id: string;
    title: string;
    content: string;
    noteDate: Timestamp;
    categoryId: string | null;
}