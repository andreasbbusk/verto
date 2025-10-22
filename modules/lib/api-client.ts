import type {
  Flashcard,
  FlashcardSet,
  CreateFlashcardData,
  UpdateFlashcardData,
  CreateSetData,
  UpdateSetData,
  ApiResponse,
  BulkCreateResult,
} from "@/modules/types";

export const getSets = async (): Promise<FlashcardSet[]> => {
  const response = await fetch("/api/sets");
  if (!response.ok) {
    if (response.status === 401) return [];
    throw new Error("Failed to fetch sets");
  }
  const data = await response.json();
  return data.data || [];
};

export const getSetById = async (id: number): Promise<FlashcardSet> => {
  const response = await fetch(`/api/sets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch set");
  }
  const data = await response.json();
  return data.data;
};

export const createSet = async (
  setData: CreateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  const response = await fetch("/api/sets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(setData),
  });
  return response.json();
};

export const updateSet = async (
  id: number,
  setData: UpdateSetData
): Promise<ApiResponse<FlashcardSet>> => {
  const response = await fetch(`/api/sets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(setData),
  });
  return response.json();
};

export const deleteSet = async (id: number): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/sets/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const createFlashcard = async (
  setId: number,
  flashcard: Omit<CreateFlashcardData, "setId">
): Promise<ApiResponse<Flashcard>> => {
  const response = await fetch(`/api/sets/${setId}/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flashcard),
  });
  return response.json();
};

export const updateFlashcard = async (
  setId: number,
  cardId: number,
  flashcard: UpdateFlashcardData
): Promise<ApiResponse<Flashcard>> => {
  const response = await fetch(`/api/sets/${setId}/flashcards/${cardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flashcard),
  });
  return response.json();
};

export const deleteFlashcard = async (
  setId: number,
  cardId: number
): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/sets/${setId}/flashcards/${cardId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const createFlashcardsBulk = async (
  setId: number,
  flashcards: Omit<CreateFlashcardData, "setId">[]
): Promise<ApiResponse<BulkCreateResult>> => {
  const response = await fetch(`/api/sets/${setId}/flashcards/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flashcards }),
  });
  return response.json();
};
