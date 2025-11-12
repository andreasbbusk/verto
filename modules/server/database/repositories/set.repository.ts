import { createClient } from "@/modules/lib/supabase/server";
import type { FlashcardSet, CreateSetDataInternal, UpdateSetData } from "@/modules/types";

export class SetRepository {
  async getAll(): Promise<FlashcardSet[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("sets")
      .select("*");

    if (error) {
      console.error("Error fetching sets:", error);
      return [];
    }

    return data.map(this.mapToSet);
  }

  async getById(id: string): Promise<FlashcardSet | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("sets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching set:", error);
      return null;
    }

    return this.mapToSet(data);
  }

  async getByIdWithFlashcards(id: string): Promise<FlashcardSet | null> {
    const supabase = await createClient();
    
    const { data: setData, error: setError } = await supabase
      .from("sets")
      .select("*")
      .eq("id", id)
      .single();

    if (setError) {
      console.error("Error fetching set:", setError);
      return null;
    }

    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("set_id", id)
      .order("created_at", { ascending: true });

    if (flashcardsError) {
      console.error("Error fetching flashcards:", flashcardsError);
    }

    const flashcards = (flashcardsData || []).map(this.mapToFlashcard);

    return {
      ...this.mapToSet(setData),
      flashcards,
      cardCount: flashcards.length,
    };
  }

  async getByUserId(userId: string): Promise<FlashcardSet[]> {
    const supabase = await createClient();
    
    const { data: setsData, error: setsError } = await supabase
      .from("sets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (setsError) {
      console.error("Error fetching user sets:", setsError);
      return [];
    }

    // Get card counts for each set
    const setsWithCounts = await Promise.all(
      setsData.map(async (setData) => {
        const { count, error } = await supabase
          .from("flashcards")
          .select("*", { count: "exact", head: true })
          .eq("set_id", setData.id);

        return {
          ...this.mapToSet(setData),
          cardCount: error ? 0 : (count || 0),
        };
      })
    );

    return setsWithCounts;
  }

  async create(data: CreateSetDataInternal): Promise<FlashcardSet> {
    const supabase = await createClient();

    // Check if set with same name exists for this user
    const { data: existingSets, error: checkError } = await supabase
      .from("sets")
      .select("id")
      .eq("user_id", data.userId)
      .ilike("name", data.name.trim());

    if (checkError) {
      console.error("Error checking existing sets:", checkError);
      throw new Error("Failed to check existing sets");
    }

    if (existingSets && existingSets.length > 0) {
      throw new Error("Set already exists");
    }

    const { data: newSet, error } = await supabase
      .from("sets")
      .insert({
        user_id: data.userId,
        name: data.name.trim(),
        description: data.description?.trim() || "",
        difficulty: data.difficulty || 3,
        starred: data.starred || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating set:", error);
      throw new Error("Failed to create set");
    }

    return { ...this.mapToSet(newSet), cardCount: 0 };
  }

  async update(id: string, data: UpdateSetData): Promise<FlashcardSet> {
    const supabase = await createClient();
    
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.starred !== undefined) updateData.starred = data.starred;

    const { data: updatedSet, error } = await supabase
      .from("sets")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating set:", error);
      throw new Error("Set not found");
    }

    // Get card count
    const { count } = await supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("set_id", id);

    return { ...this.mapToSet(updatedSet), cardCount: count || 0 };
  }

  async delete(id: string): Promise<FlashcardSet> {
    const supabase = await createClient();
    
    const setToDelete = await this.getById(id);
    if (!setToDelete) {
      throw new Error("Set not found");
    }

    // Flashcards will be automatically deleted due to cascade delete in database
    const { error } = await supabase
      .from("sets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting set:", error);
      throw new Error("Failed to delete set");
    }

    return setToDelete;
  }

  private mapToSet(data: any): FlashcardSet {
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      difficulty: data.difficulty,
      starred: data.starred,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapToFlashcard(data: any): any {
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
