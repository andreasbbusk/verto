import { createClient } from "@/modules/lib/supabase/server";
import type { Flashcard, CreateFlashcardDataInternal, UpdateFlashcardData } from "@/modules/types";

export class FlashcardRepository {
  async getAll(): Promise<Flashcard[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("flashcards")
      .select("*");

    if (error) {
      console.error("Error fetching flashcards:", error);
      return [];
    }

    return data.map(this.mapToFlashcard);
  }

  async getById(id: string): Promise<Flashcard | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching flashcard:", error);
      return null;
    }

    return this.mapToFlashcard(data);
  }

  async getBySetId(setId: string): Promise<Flashcard[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("set_id", setId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching flashcards by set:", error);
      return [];
    }

    return data.map(this.mapToFlashcard);
  }

  async getByUserId(userId: string): Promise<Flashcard[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user flashcards:", error);
      return [];
    }

    return data.map(this.mapToFlashcard);
  }

  async create(data: CreateFlashcardDataInternal): Promise<Flashcard> {
    const supabase = await createClient();
    
    const { data: newFlashcard, error } = await supabase
      .from("flashcards")
      .insert({
        set_id: data.setId,
        user_id: data.userId,
        front: data.front.trim(),
        back: data.back.trim(),
        starred: data.starred || false,
        review_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating flashcard:", error);
      throw new Error("Failed to create flashcard");
    }

    return this.mapToFlashcard(newFlashcard);
  }

  async update(id: string, data: UpdateFlashcardData): Promise<Flashcard> {
    const supabase = await createClient();
    
    const updateData: any = {};
    
    if (data.front !== undefined) updateData.front = data.front.trim();
    if (data.back !== undefined) updateData.back = data.back.trim();
    if (data.starred !== undefined) updateData.starred = data.starred;

    const { data: updatedFlashcard, error } = await supabase
      .from("flashcards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating flashcard:", error);
      throw new Error("Flashcard not found");
    }

    return this.mapToFlashcard(updatedFlashcard);
  }

  async delete(id: string): Promise<Flashcard> {
    const supabase = await createClient();
    
    const flashcardToDelete = await this.getById(id);
    if (!flashcardToDelete) {
      throw new Error("Flashcard not found");
    }

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting flashcard:", error);
      throw new Error("Failed to delete flashcard");
    }

    return flashcardToDelete;
  }

  private mapToFlashcard(data: any): Flashcard {
    return {
      id: data.id,
      setId: data.set_id,
      userId: data.user_id,
      front: data.front,
      back: data.back,
      starred: data.starred,
      reviewCount: data.review_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      performance: data.performance,
    };
  }
}
