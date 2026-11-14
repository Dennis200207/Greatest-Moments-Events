import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

type EventPhoto = { id: string; event_id: string; storage_path: string; public_url: string; sort_order: number; is_thumbnail?: boolean; cloudinary_public_id?: string | null; created_at?: string };
type GalleryEvent = { id: string; title: string; category: string; event_date: string | null; location: string; description: string | null; published: boolean; event_photos: EventPhoto[] };
type Props = { page: "gallery" | "admin"; language: "en" | "el" };
const categories = ["Wedding", "Christening", "Birthday party", "Private celebration", "Corporate event", "Other"];
const words = {
  en: { gallery: "Our event gallery", subtitle: "Explore real celebrations, one story at a time.", all: "All occasions", locations: "Filter by location", clear: "Show all locations", empty: "No events match these filters yet.", loading: "Loading events…", noConfig: "The gallery is being connected. Please check back soon.", admin: "Gallery administration", login: "Sign in to manage your gallery", email: "Email address", password: "Password", signIn: "Sign in", signOut: "Sign out", title: "Event name", category: "Occasion", date: "Event date", location: "Location", description: "Short description", photos: "Upload photos", save: "Save event", update: "Update event", cancel: "Cancel edit", published: "Visible to visitors", yourEvents: "Your event folders", noEvents: "No folders yet. Create your first event above.", edit: "Edit", remove: "Delete", saved: "Event saved.", failed: "Something went wrong. Please try again.", adminOnly: "Your account is signed in but is not authorised as an administrator. Add its user ID to the admin_users table in Supabase.", open: "View event", back: "Back to events", photoCount: "photos", search: "Search events", searchPlaceholder: "Name, description, location…", year: "Year", allYears: "All years", from: "From", to: "To", sortBy: "Sort by", newest: "Newest first", oldest: "Oldest first", alphabetical: "Name A–Z", clearAll: "Clear all filters", eventsFound: "events found", arrangePhotos: "Arrange event photos", dragHelp: "Drag photos to reorder them. Use the arrows for keyboard-friendly movement.", signInError: "Sign-in failed. Check your email and password." },
  el: { gallery: "Η συλλογή εκδηλώσεών μας", subtitle: "Ανακαλύψτε πραγματικές εκδηλώσεις, μία ιστορία κάθε φορά.", all: "Όλες οι περιστάσεις", locations: "Φιλτράρισμα ανά τοποθεσία", clear: "Εμφάνιση όλων των τοποθεσιών", empty: "Δεν υπάρχουν εκδηλώσεις με αυτά τα φίλτρα.", loading: "Φόρτωση εκδηλώσεων…", noConfig: "Η συλλογή συνδέεται αυτή τη στιγμή. Δοκιμάστε ξανά σύντομα.", admin: "Διαχείριση gallery", login: "Συνδεθείτε για να διαχειριστείτε τη συλλογή", email: "Email", password: "Κωδικός", signIn: "Σύνδεση", signOut: "Αποσύνδεση", title: "Όνομα εκδήλωσης", category: "Περίσταση", date: "Ημερομηνία", location: "Τοποθεσία", description: "Σύντομη περιγραφή", photos: "Μεταφόρτωση φωτογραφιών", save: "Αποθήκευση", update: "Ενημέρωση εκδήλωσης", cancel: "Ακύρωση", published: "Ορατή στους επισκέπτες", yourEvents: "Οι φάκελοί σας", noEvents: "Δεν υπάρχουν φάκελοι. Δημιουργήστε τον πρώτο σας.", edit: "Επεξεργασία", remove: "Διαγραφή", saved: "Η εκδήλωση αποθηκεύτηκε.", failed: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.", adminOnly: "Ο λογαριασμός συνδέθηκε αλλά δεν έχει δικαιώματα διαχειριστή. Προσθέστε το User ID στον πίνακα admin_users του Supabase.", open: "Προβολή εκδήλωσης", back: "Πίσω στις εκδηλώσεις", photoCount: "φωτογραφίες", search: "Αναζήτηση εκδηλώσεων", searchPlaceholder: "Όνομα, περιγραφή, τοποθεσία…", year: "Έτος", allYears: "Όλα τα έτη", from: "Από", to: "Έως", sortBy: "Ταξινόμηση", newest: "Νεότερες πρώτα", oldest: "Παλαιότερες πρώτα", alphabetical: "Όνομα Α–Ω", clearAll: "Καθαρισμός φίλτρων", eventsFound: "εκδηλώσεις βρέθηκαν", arrangePhotos: "Ταξινόμηση φωτογραφιών", dragHelp: "Σύρετε τις φωτογραφίες για αλλαγή σειράς ή χρησιμοποιήστε τα βέλη.", signInError: "Η σύνδεση απέτυχε. Ελέγξτε email και κωδικό." }
};

export function GalleryExperience({ page, language }: Props) {
  const t = words[language];
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortMode, setSortMode] = useState("newest");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationsTouched, setLocationsTouched] = useState(false);
  const [activeEvent, setActiveEvent] = useState<GalleryEvent | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [viewerImageError, setViewerImageError] = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ title: "", category: categories[0], event_date: "", location: "", description: "", published: true });
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedThumbnailId, setSelectedThumbnailId] = useState<string>("");
  const [selectedThumbnailFileIndex, setSelectedThumbnailFileIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState({ done: 0, total: 0 });

  const sortEventPhotos = (items: GalleryEvent[]) => items.map(event => ({ ...event, event_photos: [...(event.event_photos || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.created_at || "").localeCompare(b.created_at || "")) }));

  const loadEvents = async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.from("event_folders").select("*, event_photos(*)").eq("published", true).order("event_date", { ascending: false });
    if (error) setNotice(error.message);
    else setEvents(sortEventPhotos((data || []) as GalleryEvent[]));
    setLoading(false);
  };

  useEffect(() => { void loadEvents(); }, []);
  useEffect(() => {
    if (!activeEvent) { returnFocusRef.current?.focus(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeEvent]);
  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setActivePhotoIndex(null); setZoomed(false); }
      if (event.key === "ArrowLeft") { setActivePhotoIndex(index => Math.max(0, (index ?? 0) - 1)); setZoomed(false); setViewerImageError(false); }
      if (event.key === "ArrowRight") { setActivePhotoIndex(index => Math.min((activeEvent?.event_photos.length || 1) - 1, (index ?? 0) + 1)); setZoomed(false); setViewerImageError(false); }
    };
    window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, activeEvent]);
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => { if (alive) setSession(data.session); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setIsAdmin(false); });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    const check = async () => {
      if (!supabase || !session?.user?.id) { setIsAdmin(false); return; }
      const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(!error && !!data);
    };
    void check();
  }, [session]);
  useEffect(() => {
    if (page === "admin" && isAdmin && supabase) {
      supabase.from("event_folders").select("*, event_photos(*)").order("created_at", { ascending: false }).then(({ data, error }) => {
        if (error) setNotice(error.message); else setEvents(sortEventPhotos((data || []) as GalleryEvent[]));
      });
    }
  }, [page, isAdmin]);

  const locations = useMemo(() => Array.from(new Set(events.map(e => e.location).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [events]);
  const years = useMemo(() => Array.from(new Set(events.map(e => e.event_date?.slice(0, 4)).filter((year): year is string => !!year))).sort((a, b) => b.localeCompare(a)), [events]);
  const visibleEvents = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase();
    const filtered = events.filter(e => (category === "All" || e.category === category) && (!locationsTouched || selectedLocations.includes(e.location)) && (yearFilter === "All" || e.event_date?.slice(0, 4) === yearFilter) && (!dateFrom || (!!e.event_date && e.event_date >= dateFrom)) && (!dateTo || (!!e.event_date && e.event_date <= dateTo)) && (!term || `${e.title} ${e.description || ""} ${e.location} ${e.category}`.toLocaleLowerCase().includes(term)));
    return filtered.sort((a,b) => sortMode === "oldest" ? (a.event_date || "").localeCompare(b.event_date || "") : sortMode === "alphabetical" ? a.title.localeCompare(b.title) : (b.event_date || "").localeCompare(a.event_date || ""));
  }, [events, category, locationsTouched, selectedLocations, searchTerm, yearFilter, dateFrom, dateTo, sortMode]);
  const toggleLocation = (location: string) => {
    setLocationsTouched(true);
    setSelectedLocations(current => { const base = locationsTouched ? current : locations; return base.includes(location) ? base.filter(x => x !== location) : [...base, location]; });
  };
  const resetFilters = () => { setCategory("All"); setLocationsTouched(false); setSelectedLocations([]); setSearchTerm(""); setYearFilter("All"); setDateFrom(""); setDateTo(""); setSortMode("newest"); };

  const reorderPhotos = async (eventId: string, draggedId: string, targetId: string) => {
    if (!supabase || draggedId === targetId) return;
    const original = events.find(item => item.id === eventId);
    if (!original) return;
    const ordered = [...original.event_photos].sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const from = ordered.findIndex(photo => photo.id === draggedId), to = ordered.findIndex(photo => photo.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = ordered.splice(from, 1); ordered.splice(to, 0, moved);
    const updated = ordered.map((photo,index) => ({...photo, sort_order:index}));
    setEvents(current => current.map(item => item.id === eventId ? {...item,event_photos:updated} : item));
    setActiveEvent(current => current?.id === eventId ? {...current,event_photos:updated} : current);
    try {
      const results = await Promise.all(updated.map(photo => supabase!.from("event_photos").update({sort_order:photo.sort_order}).eq("id",photo.id).eq("event_id",eventId)));
      const failed = results.find(result => result.error); if (failed?.error) throw failed.error;
      setNotice(language === "el" ? "Η σειρά φωτογραφιών αποθηκεύτηκε." : "Photo order saved.");
    } catch (error:any) {
      setEvents(current => current.map(item => item.id === eventId ? original : item));
      setActiveEvent(current => current?.id === eventId ? original : current);
      setNotice(error?.message || t.failed);
    }
  };

  const callCloudinaryAdmin = async (payload: Record<string, unknown>) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error("Please sign in again.");
    const response = await fetch(import.meta.env.VITE_SUPABASE_URL + "/functions/v1/cloudinary-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + accessToken, apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.error || "Cloudinary service request failed.");
    return result;
  };

  const uploadToCloudinary = async (file: File, eventId: string, photoId: string) => {
    const publicId = "greatest-moments/" + eventId + "/" + photoId;
    const signed = await callCloudinaryAdmin({ action: "sign-upload", publicId });
    const uploadData = new FormData();
    uploadData.set("file", file);
    uploadData.set("api_key", signed.apiKey);
    uploadData.set("timestamp", String(signed.timestamp));
    uploadData.set("public_id", signed.publicId);
    uploadData.set("overwrite", "false");
    uploadData.set("signature", signed.signature);
    const response = await fetch("https://api.cloudinary.com/v1_1/" + signed.cloudName + "/image/upload", { method: "POST", body: uploadData });
    const result = await response.json();
    if (!response.ok || !result.secure_url || !result.public_id) throw new Error(result?.error?.message || "Cloudinary image upload failed.");
    return result as { public_id: string; secure_url: string };
  };

  const migrateExistingPhotos = async () => {
    if (!supabase || !isAdmin || migrationRunning) return;
    setMigrationRunning(true);
    setNotice("");
    try {
      const { data: photos, error } = await supabase.from("event_photos").select("id,event_id,storage_path,public_url,cloudinary_public_id").is("cloudinary_public_id", null).order("created_at", { ascending: true });
      if (error) throw error;
      const pending = photos || [];
      setMigrationProgress({ done: 0, total: pending.length });
      let completed = 0;
      const failures: string[] = [];
      for (const photo of pending) {
        try {
          const source = await fetch(photo.public_url);
          if (!source.ok) throw new Error("Could not download the original Supabase image.");
          const blob = await source.blob();
          const extension = blob.type.split("/")[1]?.split("+")[0] || "jpg";
          const file = new File([blob], photo.id + "." + extension, { type: blob.type || "image/jpeg" });
          const uploaded = await uploadToCloudinary(file, photo.event_id, photo.id);
          const { error: updateError } = await supabase.from("event_photos").update({ cloudinary_public_id: uploaded.public_id, public_url: uploaded.secure_url }).eq("id", photo.id).is("cloudinary_public_id", null);
          if (updateError) throw updateError;
          completed++;
        } catch (error: any) { failures.push(photo.id + ": " + (error?.message || "Unknown error")); }
        setMigrationProgress({ done: completed + failures.length, total: pending.length });
      }
      const { data: refreshed, error: refreshError } = await supabase.from("event_folders").select("*, event_photos(*)").order("created_at", { ascending: false });
      if (refreshError) throw refreshError;
      setEvents(sortEventPhotos((refreshed || []) as GalleryEvent[]));
      setNotice(failures.length ? "Migration finished: " + completed + " photos moved, " + failures.length + " failed. First error: " + failures[0] : "Migration complete: all " + completed + " existing photos are now on Cloudinary. Original Supabase copies have been retained.");
    } catch (error: any) { setNotice(error?.message || "Cloudinary migration could not be started."); }
    finally { setMigrationRunning(false); }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setNotice("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setNotice(error.message);
  };
  const signOut = async () => { if (supabase) await supabase.auth.signOut(); setIsAdmin(false); };
  const resetForm = () => { setForm({ title: "", category: categories[0], event_date: "", location: "", description: "", published: true }); setFiles(null); setEditingId(null); setSelectedThumbnailId(""); setSelectedThumbnailFileIndex(null); };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) return;
    setSaving(true); setNotice("");
    try {
      const payload = { ...form, event_date: form.event_date || null };
      let eventId = editingId;
      if (editingId) {
        const { error } = await supabase.from("event_folders").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("event_folders").insert(payload).select("id").single();
        if (error) throw error;
        eventId = data.id;
      }
      if (eventId && editingId && selectedThumbnailFileIndex === null && selectedThumbnailId) {
        const { error: clearThumbError } = await supabase.from("event_photos").update({ is_thumbnail: false }).eq("event_id", eventId);
        if (clearThumbError) throw clearThumbError;
        const { error: thumbError } = await supabase.from("event_photos").update({ is_thumbnail: true }).eq("id", selectedThumbnailId).eq("event_id", eventId);
        if (thumbError) throw thumbError;
      }
      if (eventId && files?.length) {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue;
          const photoId = crypto.randomUUID();
          const uploaded = await uploadToCloudinary(file, eventId, photoId);
          const path = "cloudinary:" + uploaded.public_id;
          const makeThumbnail = selectedThumbnailFileIndex === Array.from(files).indexOf(file) || (!editingId && selectedThumbnailFileIndex === null && Array.from(files).indexOf(file) === 0);
          if (makeThumbnail) {
            const { error: clearThumbError } = await supabase.from("event_photos").update({ is_thumbnail: false }).eq("event_id", eventId);
            if (clearThumbError) throw clearThumbError;
          }
          const existingPhotoCount = editingId ? Math.max(-1, ...(events.find(event => event.id === eventId)?.event_photos || []).map(photo => photo.sort_order ?? -1)) + 1 : 0;
          const { error: rowError } = await supabase.from("event_photos").insert({ id: photoId, event_id: eventId, storage_path: path, cloudinary_public_id: uploaded.public_id, public_url: uploaded.secure_url, sort_order: existingPhotoCount + Array.from(files).indexOf(file), is_thumbnail: makeThumbnail });
          if (rowError) throw rowError;
        }
      }
      setNotice(t.saved); resetForm();
      const { data } = await supabase.from("event_folders").select("*, event_photos(*)").order("created_at", { ascending: false });
      setEvents(sortEventPhotos((data || []) as GalleryEvent[]));
    } catch (error: any) { setNotice(error?.message || t.failed); }
    finally { setSaving(false); }
  };
  const editEvent = (event: GalleryEvent) => {
    setEditingId(event.id);
    setForm({ title: event.title, category: event.category, event_date: event.event_date || "", location: event.location, description: event.description || "", published: event.published });
    setSelectedThumbnailId(event.event_photos?.find(photo => photo.is_thumbnail)?.id || event.event_photos?.[0]?.id || "");
    setSelectedThumbnailFileIndex(null);
    setFiles(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteEvent = async (event: GalleryEvent) => {
    if (!supabase || !window.confirm("Delete this event folder and all its photos?")) return;
    const photos = event.event_photos || [];
    const cloudinaryIds = photos.map(photo => photo.cloudinary_public_id).filter((id): id is string => !!id);
    try {
      for (let i = 0; i < cloudinaryIds.length; i += 100) await callCloudinaryAdmin({ action: "delete-assets", publicIds: cloudinaryIds.slice(i, i + 100) });
      const legacyPaths = photos.map(photo => photo.storage_path).filter(path => !path.startsWith("cloudinary:"));
      if (legacyPaths.length) {
        const { error: storageError } = await supabase.storage.from("event-photos").remove(legacyPaths);
        if (storageError) throw storageError;
      }
    } catch (error: any) { setNotice(error?.message || "Could not delete all event photos. The event was not deleted."); return; }
    const { error } = await supabase.from("event_folders").delete().eq("id", event.id);
    if (error) setNotice(error.message);
    else setEvents(current => current.filter(e => e.id !== event.id));
  };

  if (!supabase) return <section className="min-h-[55vh] bg-[#26251f] px-6 py-24 text-white"><div className="mx-auto max-w-3xl"><h1 className="font-serif text-4xl">{page === "admin" ? t.admin : t.gallery}</h1><p className="mt-5 text-sm text-white/70">{t.noConfig}</p></div></section>;

  if (page === "admin") return <section className="min-h-[65vh] bg-[#f5f1ea] px-5 py-16 sm:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">Greatest Moments Events</p><h1 className="mt-2 font-serif text-4xl">{t.admin}</h1></div>{session && <button onClick={signOut} className="border border-[#b18b5c] px-5 py-3 text-xs">{t.signOut}</button>}</div>
      {!session && <form onSubmit={signIn} className="mt-10 max-w-md space-y-4 bg-white p-7 shadow-sm"><h2 className="font-serif text-2xl">{t.login}</h2><label className="block text-xs">{t.email}<input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label><label className="block text-xs">{t.password}<input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label><button className="bg-[#292720] px-7 py-3 text-xs uppercase tracking-widest text-white">{t.signIn}</button></form>}
      {session && !isAdmin && <p className="mt-8 max-w-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">{t.adminOnly}</p>}
      {session && isAdmin && <><div className="mt-8 border border-[#e5ded3] bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif text-xl">Cloudinary photo migration</h2><p className="mt-1 text-xs text-[#777168]">Move existing Supabase photos to Cloudinary. Original files remain in Supabase until you verify the migration.</p></div><button type="button" onClick={() => void migrateExistingPhotos()} disabled={migrationRunning} className="bg-[#292720] px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50">{migrationRunning ? "Migrating…" : "Migrate existing photos"}</button></div>{migrationRunning && <div className="mt-4"><div className="h-2 overflow-hidden bg-[#eee8df]"><div className="h-full bg-[#a17d4e] transition-all" style={{ width: migrationProgress.total ? (Math.round((migrationProgress.done / migrationProgress.total) * 100) + "%") : "0%" }} /></div><p className="mt-2 text-xs text-[#777168]">{migrationProgress.done} / {migrationProgress.total} photos processed</p></div>}</div><form onSubmit={saveEvent} className="mt-10 grid gap-5 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
        <h2 className="font-serif text-2xl sm:col-span-2">{editingId ? t.update : t.save}</h2>
        <label className="text-xs">{t.title}<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs">{t.category}<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-2 w-full border border-[#e5ded3] bg-white px-4 py-3 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="text-xs">{t.date}<input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs">{t.location}<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Athens, Greece" className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs sm:col-span-2">{t.description}<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs sm:col-span-2">{t.photos}<input type="file" accept="image/*" multiple onChange={e => { setFiles(e.target.files); setSelectedThumbnailFileIndex(e.target.files?.length ? (editingId ? null : 0) : null); }} className="mt-2 block w-full border border-dashed border-[#b18b5c] p-4 text-sm" /></label>
        {editingId && events.find(event => event.id === editingId)?.event_photos?.length ? <div className="sm:col-span-2"><p className="mb-3 text-xs font-medium">Choose the folder thumbnail from existing photos</p><div className="flex flex-wrap gap-3">{events.find(event => event.id === editingId)!.event_photos.map(photo => <label key={photo.id} className={"cursor-pointer border p-2 " + (selectedThumbnailFileIndex === null && selectedThumbnailId === photo.id ? "border-[#a17d4e] bg-[#f5f1ea]" : "border-[#e5ded3]")}><img src={photo.public_url} alt="" className="h-24 w-32 object-cover" /><span className="mt-2 flex items-center gap-2 text-xs"><input type="radio" name="existing-thumbnail" checked={selectedThumbnailFileIndex === null && selectedThumbnailId === photo.id} onChange={() => { setSelectedThumbnailId(photo.id); setSelectedThumbnailFileIndex(null); }} />Use as thumbnail</span></label>)}</div></div> : null}
        {editingId && events.find(event => event.id === editingId)?.event_photos?.length ? <div className="sm:col-span-2"><div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h3 className="text-sm font-medium">{t.arrangePhotos}</h3><p className="mt-1 text-xs text-[#777168]">{t.dragHelp}</p></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{[...events.find(event => event.id === editingId)!.event_photos].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)).map((photo,index,ordered)=><div key={photo.id} draggable onDragStart={()=>setDraggedPhotoId(photo.id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(draggedPhotoId)void reorderPhotos(editingId,draggedPhotoId,photo.id);setDraggedPhotoId(null);}} onDragEnd={()=>setDraggedPhotoId(null)} className={`border bg-white p-2 ${draggedPhotoId===photo.id?"opacity-40":""}`}><img src={photo.public_url} alt="" className="h-28 w-full object-cover" /><p className="mt-2 truncate text-[10px] text-[#777168]">{index+1}. {photo.is_thumbnail?"Folder thumbnail":"Photo"}</p><div className="mt-2 flex justify-between gap-2"><button type="button" disabled={index===0} onClick={()=>void reorderPhotos(editingId,photo.id,ordered[index-1].id)} aria-label={`Move photo ${index+1} earlier`} className="border px-3 py-1 text-xs disabled:opacity-30">↑</button><button type="button" disabled={index===ordered.length-1} onClick={()=>void reorderPhotos(editingId,photo.id,ordered[index+1].id)} aria-label={`Move photo ${index+1} later`} className="border px-3 py-1 text-xs disabled:opacity-30">↓</button></div></div>)}</div></div> : null}
        {files?.length ? <div className="sm:col-span-2"><p className="mb-3 text-xs font-medium">Choose a newly uploaded photo as the folder thumbnail</p><div className="flex flex-wrap gap-3">{Array.from(files).map((file, index) => <label key={index} className={"cursor-pointer border p-2 " + (selectedThumbnailFileIndex === index ? "border-[#a17d4e] bg-[#f5f1ea]" : "border-[#e5ded3]")}><span className="block max-w-40 truncate text-xs">{file.name}</span><span className="mt-2 flex items-center gap-2 text-xs"><input type="radio" name="new-thumbnail" checked={selectedThumbnailFileIndex === index} onChange={() => setSelectedThumbnailFileIndex(index)} />Use as thumbnail</span></label>)}</div></div> : null}
        <label className="flex items-center gap-3 text-xs sm:col-span-2"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />{t.published}</label>
        <div className="flex flex-wrap gap-3 sm:col-span-2"><button disabled={saving} className="bg-[#292720] px-7 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50">{saving ? "…" : editingId ? t.update : t.save}</button>{editingId && <button type="button" onClick={resetForm} className="border border-[#d9d1c5] px-5 py-3 text-xs">{t.cancel}</button>}</div>
      </form>
      <div className="mt-12"><h2 className="font-serif text-2xl">{t.yourEvents}</h2><div className="mt-5 space-y-3">{events.length === 0 && <p className="text-sm text-[#777168]">{t.noEvents}</p>}{events.map(event => <article key={event.id} className="flex flex-wrap items-center justify-between gap-4 border border-[#e5ded3] bg-white p-4"><div className="flex items-center gap-4">{(event.event_photos?.find(photo => photo.is_thumbnail) || event.event_photos?.[0]) && <img src={(event.event_photos.find(photo => photo.is_thumbnail) || event.event_photos[0]).public_url} className="h-16 w-20 object-cover" />}<div><h3 className="font-serif text-lg">{event.title}</h3><p className="text-xs text-[#777168]">{event.category} · {event.location} · {event.event_photos?.length || 0} {t.photoCount} · {event.published ? "Published" : "Draft"}</p></div></div><div className="flex gap-2"><button onClick={() => editEvent(event)} className="border border-[#b18b5c] px-4 py-2 text-xs">{t.edit}</button><button onClick={() => void deleteEvent(event)} className="border border-red-200 px-4 py-2 text-xs text-red-700">{t.remove}</button></div></article>)}</div></div></>}
      {notice && <p role="status" className="mt-5 text-sm text-[#8b6339]">{notice}</p>}
    </div>
  </section>;

  return <section className="min-h-[65vh] bg-[#26251f] px-5 py-20 text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#d1b48b]">A glimpse of the possibilities</p><h1 className="mt-4 font-serif text-4xl sm:text-5xl">{t.gallery}</h1><p className="mt-4 max-w-xl text-sm text-white/65">{t.subtitle}</p></div><a href="https://www.facebook.com/greatestmomentsevents" target="_blank" rel="noreferrer" className="border-b border-[#b18b5c] pb-2 text-[10px] uppercase tracking-[.2em] text-[#e5cda9]">Visit our Facebook ↗</a></div>
      <div className="mt-10 grid gap-3 rounded-sm border border-white/15 bg-white/[.04] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs text-white/75 lg:col-span-2">{t.search}<input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t.searchPlaceholder} className="mt-2 w-full border border-white/20 bg-[#333128] px-3 py-2 text-sm text-white placeholder:text-white/35" /></label>
        <label className="text-xs text-white/75">{t.year}<select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="mt-2 w-full border border-white/20 bg-[#333128] px-3 py-2 text-sm text-white"><option value="All">{t.allYears}</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
        <label className="text-xs text-white/75">{t.from}<input type="date" value={dateFrom} max={dateTo || undefined} onChange={e => setDateFrom(e.target.value)} className="mt-2 w-full border border-white/20 bg-[#333128] px-3 py-2 text-sm text-white" /></label>
        <label className="text-xs text-white/75">{t.to}<input type="date" value={dateTo} min={dateFrom || undefined} onChange={e => setDateTo(e.target.value)} className="mt-2 w-full border border-white/20 bg-[#333128] px-3 py-2 text-sm text-white" /></label>
        <label className="text-xs text-white/75 sm:col-span-2 lg:col-span-1">{t.sortBy}<select value={sortMode} onChange={e => setSortMode(e.target.value)} className="mt-2 w-full border border-white/20 bg-[#333128] px-3 py-2 text-sm text-white"><option value="newest">{t.newest}</option><option value="oldest">{t.oldest}</option><option value="alphabetical">{t.alphabetical}</option></select></label>
        <p className="self-end text-xs text-white/55 sm:col-span-2 lg:col-span-4">{visibleEvents.length} {t.eventsFound}</p><button onClick={resetFilters} className="border border-white/25 px-3 py-2 text-xs text-white/75 hover:bg-white/10">{t.clearAll}</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2"><button onClick={() => setCategory("All")} className={"border px-4 py-2 text-xs " + (category === "All" ? "border-[#c6a477] bg-[#a17d4e] text-white" : "border-white/20 text-white/70")}>{t.all}</button>{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={"border px-4 py-2 text-xs " + (category === c ? "border-[#c6a477] bg-[#a17d4e] text-white" : "border-white/20 text-white/70")}>{c}</button>)}</div>
      {locations.length > 0 && <div className="mt-8 border-y border-white/15 py-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xs uppercase tracking-[.2em] text-[#e5cda9]">{t.locations}</h2><button onClick={() => { setLocationsTouched(false); setSelectedLocations([]); }} className="text-xs text-white/60 underline">{t.clear}</button></div><div className="flex flex-wrap gap-3">{locations.map(location => <label key={location} className="flex cursor-pointer items-center gap-2 text-xs text-white/80"><input type="checkbox" checked={!locationsTouched || selectedLocations.includes(location)} onChange={() => toggleLocation(location)} className="accent-[#b18b5c]" />{location}</label>)}</div></div>}
      {loading ? <p className="py-16 text-sm text-white/60">{t.loading}</p> : visibleEvents.length === 0 ? <p className="py-16 text-sm text-white/60">{t.empty}</p> : <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleEvents.map(event => <button key={event.id} onClick={e => { returnFocusRef.current = e.currentTarget; setActiveEvent(event); }} className="group overflow-hidden bg-[#333128] text-left"><div className="overflow-hidden"><img src={(event.event_photos?.find(photo => photo.is_thumbnail) || event.event_photos?.[0])?.public_url || ""} alt={event.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /></div><div className="p-5"><p className="text-[9px] uppercase tracking-[.2em] text-[#d1b48b]">{event.category}</p><h2 className="mt-2 font-serif text-2xl">{event.title}</h2><p className="mt-2 text-xs text-white/65">{event.location}{event.event_date ? " · " + new Date(event.event_date + "T00:00:00").toLocaleDateString(language === "el" ? "el-GR" : "en-GB") : ""}</p><p className="mt-3 text-[10px] text-white/45">{event.event_photos?.length || 0} {t.photoCount} · {t.open} ↗</p></div></button>)}</div>}
    </div>
    {activeEvent && <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 p-5 sm:p-10" role="dialog" aria-modal="true" aria-label={activeEvent.title}><div className="mx-auto max-w-6xl"><button onClick={() => { setActiveEvent(null); setActivePhotoIndex(null); setZoomed(false); }} className="mb-6 border border-white/30 px-4 py-2 text-xs text-white">× {t.back}</button><p className="text-[10px] uppercase tracking-[.2em] text-[#d1b48b]">{activeEvent.category} · {activeEvent.location}</p><h2 className="mt-2 font-serif text-4xl text-white">{activeEvent.title}</h2>{activeEvent.description && <p className="mt-3 max-w-2xl text-sm text-white/70">{activeEvent.description}</p>}<div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">{[...(activeEvent.event_photos || [])].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)).map((photo,index)=><button type="button" key={photo.id} onClick={()=>{setActivePhotoIndex(index);setZoomed(false);setViewerImageError(false);}} aria-label={`Open photo ${index+1}`} className="group overflow-hidden text-left"><img src={photo.public_url} alt={`${activeEvent.title} ${index+1}`} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72" loading="lazy" /></button>)}</div></div></div>}
    {activeEvent && activePhotoIndex !== null && activeEvent.event_photos?.[activePhotoIndex] && <div className="fixed inset-0 z-[120] flex flex-col bg-black text-white" role="dialog" aria-modal="true" aria-label="Full-screen photo viewer" onTouchStart={e=>setTouchStartX(e.touches[0]?.clientX??null)} onTouchEnd={e=>{if(touchStartX!==null){const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>50){setActivePhotoIndex(index=>Math.max(0,Math.min((activeEvent.event_photos?.length||1)-1,(index??0)+(delta<0?1:-1))));setZoomed(false);setViewerImageError(false);}}setTouchStartX(null);}}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"><p className="text-xs text-white/70">{activeEvent.title} · {activePhotoIndex+1} / {activeEvent.event_photos.length}</p><div className="flex items-center gap-2"><button onClick={()=>setZoomed(value=>!value)} className="border border-white/30 px-3 py-2 text-xs">{zoomed?"Fit":"Zoom"}</button><button onClick={()=>{setActivePhotoIndex(null);setZoomed(false);setViewerImageError(false);}} aria-label="Close full-screen viewer" className="border border-white/30 px-3 py-2 text-lg leading-none">×</button></div></div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-12 pb-4"><button disabled={activePhotoIndex===0} onClick={()=>{setActivePhotoIndex(index=>Math.max(0,(index??0)-1));setZoomed(false);}} aria-label="Previous photo" className="absolute left-2 z-10 border border-white/30 px-3 py-3 text-xl disabled:opacity-25">‹</button>{viewerImageError ? <p className="text-sm text-white/70">This photo could not be loaded.</p> : <img src={activeEvent.event_photos[activePhotoIndex].public_url} alt={`${activeEvent.title} ${activePhotoIndex+1}`} onError={()=>setViewerImageError(true)} className={`max-h-full max-w-full object-contain transition-transform duration-200 ${zoomed?"scale-150 cursor-zoom-out":"cursor-zoom-in"}`} onClick={()=>setZoomed(value=>!value)} />}<button disabled={activePhotoIndex>=activeEvent.event_photos.length-1} onClick={()=>{setActivePhotoIndex(index=>Math.min(activeEvent.event_photos.length-1,(index??0)+1));setZoomed(false);}} aria-label="Next photo" className="absolute right-2 z-10 border border-white/30 px-3 py-3 text-xl disabled:opacity-25">›</button></div>
    </div>}
  </section>;
}
