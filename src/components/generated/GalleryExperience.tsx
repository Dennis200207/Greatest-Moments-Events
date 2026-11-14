import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type EventPhoto = { id: string; event_id: string; storage_path: string; public_url: string; sort_order: number; is_thumbnail?: boolean };
type GalleryEvent = { id: string; title: string; category: string; event_date: string | null; location: string; description: string | null; published: boolean; event_photos: EventPhoto[] };
type Props = { page: "gallery" | "admin"; language: "en" | "el" };
const categories = ["Wedding", "Christening", "Birthday party", "Private celebration", "Corporate event", "Other"];
const words = {
  en: { gallery: "Our event gallery", subtitle: "Explore real celebrations, one story at a time.", all: "All occasions", locations: "Filter by location", clear: "Show all locations", empty: "No events match these filters yet.", loading: "Loading events…", noConfig: "The gallery is being connected. Please check back soon.", admin: "Gallery administration", login: "Sign in to manage your gallery", email: "Email address", password: "Password", signIn: "Sign in", signOut: "Sign out", title: "Event name", category: "Occasion", date: "Event date", location: "Location", description: "Short description", photos: "Upload photos", save: "Save event", update: "Update event", cancel: "Cancel edit", published: "Visible to visitors", yourEvents: "Your event folders", noEvents: "No folders yet. Create your first event above.", edit: "Edit", remove: "Delete", saved: "Event saved.", failed: "Something went wrong. Please try again.", adminOnly: "Your account is signed in but is not authorised as an administrator. Add its user ID to the admin_users table in Supabase.", open: "View event", back: "Back to events", photoCount: "photos", signInError: "Sign-in failed. Check your email and password." },
  el: { gallery: "Η συλλογή εκδηλώσεών μας", subtitle: "Ανακαλύψτε πραγματικές εκδηλώσεις, μία ιστορία κάθε φορά.", all: "Όλες οι περιστάσεις", locations: "Φιλτράρισμα ανά τοποθεσία", clear: "Εμφάνιση όλων των τοποθεσιών", empty: "Δεν υπάρχουν εκδηλώσεις με αυτά τα φίλτρα.", loading: "Φόρτωση εκδηλώσεων…", noConfig: "Η συλλογή συνδέεται αυτή τη στιγμή. Δοκιμάστε ξανά σύντομα.", admin: "Διαχείριση gallery", login: "Συνδεθείτε για να διαχειριστείτε τη συλλογή", email: "Email", password: "Κωδικός", signIn: "Σύνδεση", signOut: "Αποσύνδεση", title: "Όνομα εκδήλωσης", category: "Περίσταση", date: "Ημερομηνία", location: "Τοποθεσία", description: "Σύντομη περιγραφή", photos: "Μεταφόρτωση φωτογραφιών", save: "Αποθήκευση", update: "Ενημέρωση εκδήλωσης", cancel: "Ακύρωση", published: "Ορατή στους επισκέπτες", yourEvents: "Οι φάκελοί σας", noEvents: "Δεν υπάρχουν φάκελοι. Δημιουργήστε τον πρώτο σας.", edit: "Επεξεργασία", remove: "Διαγραφή", saved: "Η εκδήλωση αποθηκεύτηκε.", failed: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.", adminOnly: "Ο λογαριασμός συνδέθηκε αλλά δεν έχει δικαιώματα διαχειριστή. Προσθέστε το User ID στον πίνακα admin_users του Supabase.", open: "Προβολή εκδήλωσης", back: "Πίσω στις εκδηλώσεις", photoCount: "φωτογραφίες", signInError: "Η σύνδεση απέτυχε. Ελέγξτε email και κωδικό." }
};

export function GalleryExperience({ page, language }: Props) {
  const t = words[language];
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationsTouched, setLocationsTouched] = useState(false);
  const [activeEvent, setActiveEvent] = useState<GalleryEvent | null>(null);
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

  const loadEvents = async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.from("event_folders").select("*, event_photos(*)").eq("published", true).order("event_date", { ascending: false });
    if (error) setNotice(error.message);
    else setEvents((data || []) as GalleryEvent[]);
    setLoading(false);
  };

  useEffect(() => { void loadEvents(); }, []);
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
        if (error) setNotice(error.message); else setEvents((data || []) as GalleryEvent[]);
      });
    }
  }, [page, isAdmin]);

  const locations = useMemo(() => Array.from(new Set(events.map(e => e.location).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [events]);
  const visibleEvents = useMemo(() => events.filter(e => (category === "All" || e.category === category) && (!locationsTouched || selectedLocations.includes(e.location))), [events, category, locationsTouched, selectedLocations]);
  const toggleLocation = (location: string) => {
    setLocationsTouched(true);
    setSelectedLocations(current => current.includes(location) ? current.filter(x => x !== location) : [...current, location]);
  };
  const resetFilters = () => { setCategory("All"); setLocationsTouched(false); setSelectedLocations([]); };

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
          const path = eventId + "/" + crypto.randomUUID() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          const { error: uploadError } = await supabase.storage.from("event-photos").upload(path, file, { upsert: false, contentType: file.type });
          if (uploadError) throw uploadError;
          const { data: publicData } = supabase.storage.from("event-photos").getPublicUrl(path);
          const makeThumbnail = selectedThumbnailFileIndex === Array.from(files).indexOf(file) || (!editingId && selectedThumbnailFileIndex === null && Array.from(files).indexOf(file) === 0);
          if (makeThumbnail) {
            const { error: clearThumbError } = await supabase.from("event_photos").update({ is_thumbnail: false }).eq("event_id", eventId);
            if (clearThumbError) throw clearThumbError;
          }
          const { error: rowError } = await supabase.from("event_photos").insert({ event_id: eventId, storage_path: path, public_url: publicData.publicUrl, sort_order: 0, is_thumbnail: makeThumbnail });
          if (rowError) throw rowError;
        }
      }
      setNotice(t.saved); resetForm();
      const { data } = await supabase.from("event_folders").select("*, event_photos(*)").order("created_at", { ascending: false });
      setEvents((data || []) as GalleryEvent[]);
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
    const paths = (event.event_photos || []).map(p => p.storage_path);
    if (paths.length) await supabase.storage.from("event-photos").remove(paths);
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
      {session && isAdmin && <><form onSubmit={saveEvent} className="mt-10 grid gap-5 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
        <h2 className="font-serif text-2xl sm:col-span-2">{editingId ? t.update : t.save}</h2>
        <label className="text-xs">{t.title}<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs">{t.category}<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-2 w-full border border-[#e5ded3] bg-white px-4 py-3 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="text-xs">{t.date}<input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs">{t.location}<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Athens, Greece" className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs sm:col-span-2">{t.description}<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-2 w-full border border-[#e5ded3] px-4 py-3 text-sm" /></label>
        <label className="text-xs sm:col-span-2">{t.photos}<input type="file" accept="image/*" multiple onChange={e => { setFiles(e.target.files); setSelectedThumbnailFileIndex(e.target.files?.length ? (editingId ? null : 0) : null); }} className="mt-2 block w-full border border-dashed border-[#b18b5c] p-4 text-sm" /></label>
        {editingId && events.find(event => event.id === editingId)?.event_photos?.length ? <div className="sm:col-span-2"><p className="mb-3 text-xs font-medium">Choose the folder thumbnail from existing photos</p><div className="flex flex-wrap gap-3">{events.find(event => event.id === editingId)!.event_photos.map(photo => <label key={photo.id} className={"cursor-pointer border p-2 " + (selectedThumbnailFileIndex === null && selectedThumbnailId === photo.id ? "border-[#a17d4e] bg-[#f5f1ea]" : "border-[#e5ded3]")}><img src={photo.public_url} alt="" className="h-24 w-32 object-cover" /><span className="mt-2 flex items-center gap-2 text-xs"><input type="radio" name="existing-thumbnail" checked={selectedThumbnailFileIndex === null && selectedThumbnailId === photo.id} onChange={() => { setSelectedThumbnailId(photo.id); setSelectedThumbnailFileIndex(null); }} />Use as thumbnail</span></label>)}</div></div> : null}
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
      <div className="mt-10 flex flex-wrap gap-2"><button onClick={() => setCategory("All")} className={"border px-4 py-2 text-xs " + (category === "All" ? "border-[#c6a477] bg-[#a17d4e] text-white" : "border-white/20 text-white/70")}>{t.all}</button>{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={"border px-4 py-2 text-xs " + (category === c ? "border-[#c6a477] bg-[#a17d4e] text-white" : "border-white/20 text-white/70")}>{c}</button>)}</div>
      {locations.length > 0 && <div className="mt-8 border-y border-white/15 py-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xs uppercase tracking-[.2em] text-[#e5cda9]">{t.locations}</h2><button onClick={resetFilters} className="text-xs text-white/60 underline">{t.clear}</button></div><div className="flex flex-wrap gap-3">{locations.map(location => <label key={location} className="flex cursor-pointer items-center gap-2 text-xs text-white/80"><input type="checkbox" checked={!locationsTouched || selectedLocations.includes(location)} onChange={() => toggleLocation(location)} className="accent-[#b18b5c]" />{location}</label>)}</div></div>}
      {loading ? <p className="py-16 text-sm text-white/60">{t.loading}</p> : visibleEvents.length === 0 ? <p className="py-16 text-sm text-white/60">{t.empty}</p> : <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleEvents.map(event => <button key={event.id} onClick={() => setActiveEvent(event)} className="group overflow-hidden bg-[#333128] text-left"><div className="overflow-hidden"><img src={(event.event_photos?.find(photo => photo.is_thumbnail) || event.event_photos?.[0])?.public_url || ""} alt={event.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /></div><div className="p-5"><p className="text-[9px] uppercase tracking-[.2em] text-[#d1b48b]">{event.category}</p><h2 className="mt-2 font-serif text-2xl">{event.title}</h2><p className="mt-2 text-xs text-white/65">{event.location}{event.event_date ? " · " + new Date(event.event_date + "T00:00:00").toLocaleDateString(language === "el" ? "el-GR" : "en-GB") : ""}</p><p className="mt-3 text-[10px] text-white/45">{event.event_photos?.length || 0} {t.photoCount} · {t.open} ↗</p></div></button>)}</div>}
    </div>
    {activeEvent && <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 p-5 sm:p-10" role="dialog" aria-modal="true"><div className="mx-auto max-w-6xl"><button onClick={() => setActiveEvent(null)} className="mb-6 border border-white/30 px-4 py-2 text-xs text-white">× {t.back}</button><p className="text-[10px] uppercase tracking-[.2em] text-[#d1b48b]">{activeEvent.category} · {activeEvent.location}</p><h2 className="mt-2 font-serif text-4xl text-white">{activeEvent.title}</h2>{activeEvent.description && <p className="mt-3 max-w-2xl text-sm text-white/70">{activeEvent.description}</p>}<div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">{activeEvent.event_photos?.map(photo => <a key={photo.id} href={photo.public_url} target="_blank" rel="noreferrer"><img src={photo.public_url} alt={activeEvent.title} className="h-56 w-full object-cover sm:h-72" loading="lazy" /></a>)}</div></div></div>}
  </section>;
}
