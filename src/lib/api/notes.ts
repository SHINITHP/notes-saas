interface NoteData {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
};

export async function getNotes() {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/notes`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store", // Ensure fresh data on each request
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch notes: ${res.status} ${res.statusText} - ${errorText}`
      );
    }
    return (await res.json()) as NoteData[];
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}

export async function createNote(noteData: { title: string; content: string }) {
  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(noteData),
    });
    if (res.ok) {
      return (await res.json()) as NoteData;
    } else {
      throw new Error("Failed to create note");
    }
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}
