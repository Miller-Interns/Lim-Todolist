import type { TodoItem } from "@/types/TodoItem";

export type TodoCategory = {
    id: number;
    title: string;
    items: TodoItem[];
}