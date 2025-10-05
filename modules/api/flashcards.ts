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

// Set API functions
export const getSets = async (): Promise<FlashcardSet[]> => {
  const response = await api.get<ApiResponse<FlashcardSet[]>>("/api/sets");
  return response.data;
};

export const getSetById = async (id: number): Promise<FlashcardSet> => {
  const response = await api.get<ApiResponse<FlashcardSet>>(`/api/sets/${id}`);
  return response.data;
};

export const createSet = async (
  setData: CreateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  return api.post<ApiResponse<FlashcardSet>>("/api/sets", setData);
};

export const updateSet = async (
  id: number,
  setData: UpdateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  return api.put<ApiResponse<FlashcardSet>>(`/api/sets/${id}`, setData);
};

export const deleteSet = async (id: number): Promise<ApiResponse<void>> => {
  return api.delete<ApiResponse<void>>(`/api/sets/${id}`);
};

// Flashcard API functions
export const createFlashcard = async (
  setId: number,
  flashcard: Omit<CreateFlashcardData, 'setId'>
): Promise<ApiResponse<Flashcard>> => {
  return api.post<ApiResponse<Flashcard>>(
    `/api/sets/${setId}/flashcards`,
    flashcard
  );
};

export const updateFlashcard = async (
  setId: number,
  cardId: number,
  flashcard: UpdateFlashcardData
): Promise<ApiResponse<Flashcard>> => {
  return api.put<ApiResponse<Flashcard>>(
    `/api/sets/${setId}/flashcards/${cardId}`,
    flashcard
  );
};

export const deleteFlashcard = async (
  setId: number,
  cardId: number
): Promise<ApiResponse<void>> => {
  return api.delete<ApiResponse<void>>(
    `/api/sets/${setId}/flashcards/${cardId}`
  );
};