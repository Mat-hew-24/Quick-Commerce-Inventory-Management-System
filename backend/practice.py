from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client

# 🔹 Initialize app
app = FastAPI()

# 🔹 Supabase config
url = "https://juxumaobjjgeetqhupro.supabase.co"
key = "sb_publishable_U_qO6dI8REcxTVQ2O5IOsA_3QOOs4jp"

supabase = create_client(url, key)

# 🔹 Pydantic model
class Note(BaseModel):
    title: str
    content: str


# =========================
# 🟢 CREATE NOTE
# =========================
@app.post("/notes")
def add_note(note: Note):
    response = supabase.table("mini table").insert({
        "title": note.title,
        "content": note.content
    }).execute()

    return {
        "message": "Note added",
        "data": response.data
    }


# =========================
# 🔵 GET ALL NOTES
# =========================
@app.get("/notes")
def get_notes():
    response = supabase.table("mini table").select("*").execute()

    return {
        "notes": response.data
    }


# =========================
# ❌ DELETE NOTE
# =========================
@app.delete("/notes/{id}")
def delete_note(id: int):
    response = supabase.table("mini table").delete().eq("id", id).execute()

    if not response.data:
        return {"error": "Note not found"}

    return {
        "message": "Deleted successfully",
        "deleted": response.data
    }