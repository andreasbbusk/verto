import { api } from "./client";
import type { 
  Flashcard, 
  FlashcardSet, 
  CreateFlashcardData, 
  UpdateFlashcardData,
  CreateSetData,
  UpdateSetData,
  ApiResponse 
} from "@/modules/types";

// Flashcard API functions
export const getFlashcards = async (): Promise<Flashcard[]> => {
  const response = await api.get<ApiResponse<Flashcard[]>>("/api/flashcards");
  return response.data;
};

export const getFlashcardById = async (id: string): Promise<Flashcard> => {
  const response = await api.get<ApiResponse<Flashcard>>(`/api/flashcards/${id}`);
  return response.data;
};

export const getFlashcardsBySet = async (
  setName: string
): Promise<Flashcard[]> => {
  const response = await api.get<ApiResponse<Flashcard[]>>(
    `/api/sets/${encodeURIComponent(setName)}/flashcards`
  );
  return response.data;
};

export const createFlashcard = async (
  flashcard: CreateFlashcardData
): Promise<ApiResponse<Flashcard>> => {
  return api.post<ApiResponse<Flashcard>>("/api/flashcards", flashcard);
};

export const updateFlashcard = async (
  id: string,
  flashcard: UpdateFlashcardData
): Promise<ApiResponse<Flashcard>> => {
  return api.put<ApiResponse<Flashcard>>(`/api/flashcards/${id}`, flashcard);
};

export const deleteFlashcard = async (
  id: string
): Promise<ApiResponse<void>> => {
  return api.delete<ApiResponse<void>>(`/api/flashcards/${id}`);
};

// Set API functions
export const getSets = async (): Promise<FlashcardSet[]> => {
  const response = await api.get<ApiResponse<FlashcardSet[]>>("/api/sets");
  return response.data;
};

export const createSet = async (
  setData: CreateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  return api.post<ApiResponse<FlashcardSet>>("/api/sets", setData);
};

export const updateSet = async (
  id: string,
  setData: UpdateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  return api.put<ApiResponse<FlashcardSet>>(`/api/sets/${id}`, setData);
};

export const deleteSet = async (id: string): Promise<ApiResponse<void>> => {
  return api.delete<ApiResponse<void>>(`/api/sets/${id}`);
};