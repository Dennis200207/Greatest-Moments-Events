import React, { useEffect, useMemo, useState } from "react";
import { GalleryExperience } from "./GalleryExperience";

const translations: Record<string, string> = {"CREATING MOMENTS THAT LAST A LIFETIME · ATHENS, GREECE":"ΔΗΜΙΟΥΡΓΟΥΜΕ ΣΤΙΓΜΕΣ ΠΟΥ ΜΕΝΟΥΝ ΓΙΑ ΠΑΝΤΑ · ΑΘΗΝΑ, ΕΛΛΑΔΑ","EVENTS · CATERING · DESIGN":"ΕΚΔΗΛΩΣΕΙΣ · CATERING · ΔΙΑΚΟΣΜΗΣΗ","Our story":"Η ιστορία μας","Services":"Υπηρεσίες","Gallery":"Gallery","Contact":"Επικοινωνία","Plan your event":"Σχεδιάστε την εκδήλωσή σας","Your vision. Our creation.":"Το όραμά σας. Η δημιουργία μας.","Every detail.":"Κάθε λεπτομέρεια.","A moment to remember.":"Μια στιγμή που θα θυμάστε για πάντα.","From beautifully considered weddings to unforgettable celebrations, we bring people, flavours and thoughtful design together.":"Από κομψούς γάμους μέχρι αξέχαστες γιορτές, συνδυάζουμε ανθρώπους, γεύσεις και προσεγμένο σχεδιασμό.","Create your event":"Δημιουργήστε την εκδήλωσή σας","Discover our services":"Ανακαλύψτε τις υπηρεσίες μας","Made with care · Celebrated forever":"Με φροντίδα σε κάθε λεπτομέρεια · Αναμνήσεις για πάντα","The art of bringing people together":"Η τέχνη του να φέρνουμε τους ανθρώπους κοντά","More than an event.":"Κάτι περισσότερο από μια εκδήλωση.","A feeling that stays.":"Ένα συναίσθημα που μένει.","At Greatest Moments Events, we believe the most memorable celebrations are made from the details: a welcoming table, a beautiful setting, exceptional food and the people you love. We bring the elements together around your ideas and your occasion.":"Στη Greatest Moments Events πιστεύουμε ότι οι πιο αξέχαστες στιγμές δημιουργούνται μέσα από τις λεπτομέρειες: ένα φιλόξενο τραπέζι, ένα όμορφο περιβάλλον, εξαιρετικό φαγητό και τους ανθρώπους που αγαπάτε. Συνδυάζουμε όλα τα στοιχεία με βάση τις ιδέες σας και την περίστασή σας.","Let's create something beautiful":"Ας δημιουργήσουμε κάτι ξεχωριστό","Your day,":"Η μέρα σας,","beautifully brought to life":"μεταμορφώνεται σε μια υπέροχη εμπειρία","What we do":"Τι προσφέρουμε","One team. Every detail.":"Μία ομάδα. Κάθε λεπτομέρεια.","A considered collection of services, brought together around the celebration you imagine.":"Μια ολοκληρωμένη γκάμα υπηρεσιών, σχεδιασμένη γύρω από τη γιορτή που ονειρεύεστε.","Event planning":"Οργάνωση εκδηλώσεων","From the first idea to the final toast, every moment thoughtfully coordinated.":"Από την πρώτη ιδέα μέχρι την τελευταία πρόποση, φροντίζουμε κάθε στιγμή με προσοχή.","Food & catering":"Φαγητό & catering","Delicious menus, beautifully presented, made for sharing and celebrating.":"Γευστικά μενού, προσεγμένα στην παρουσίαση, ιδανικά για να τα μοιραστείτε και να γιορτάσετε.","Design & styling":"Σχεδιασμός & διακόσμηση","Atmosphere, flowers, tables and details that make the occasion yours.":"Ατμόσφαιρα, λουλούδια, τραπέζια και λεπτομέρειες που δίνουν στην εκδήλωση τον δικό σας χαρακτήρα.","Music & entertainment":"Μουσική & ψυχαγωγία","The right soundtrack, production and energy for an unforgettable gathering.":"Η κατάλληλη μουσική, η παραγωγή και η ενέργεια για μια αξέχαστη γιορτή.","Your celebration starts here":"Η γιορτή σας ξεκινά εδώ","Build your event":"Σχεδιάστε την εκδήλωσή σας","Tell us what you have in mind. Choose only the services you need and we'll help you shape the rest.":"Πείτε μας τι έχετε στο μυαλό σας. Επιλέξτε τις υπηρεσίες που χρειάζεστε και θα σας βοηθήσουμε να οργανώσουμε τα υπόλοιπα.","Step ":"Βήμα "," of 2":" από 2","What are we celebrating?":"Τι γιορτάζουμε;","A few details about your day":"Μερικές λεπτομέρειες για την εκδήλωσή σας","Choose your occasion":"Επιλέξτε την περίσταση","Select the services you're interested in":"Επιλέξτε τις υπηρεσίες που σας ενδιαφέρουν","Planning & coordination":"Οργάνωση & συντονισμός","Full event planning":"Πλήρης οργάνωση εκδήλωσης","Day-of coordination":"Συντονισμός την ημέρα της εκδήλωσης","Venue selection":"Επιλογή χώρου","Food & drinks":"Φαγητό & ποτά","Wedding catering":"Catering γάμου","Buffet & finger food":"Μπουφές & finger food","Dessert table":"Τραπέζι γλυκών","Open bar & cocktails":"Open bar & κοκτέιλ","Floral design":"Ανθοστολισμός","Table styling":"Στολισμός τραπεζιών","Wedding backdrop":"Φόντο γάμου","Themed decoration":"Θεματική διακόσμηση","Entertainment & production":"Ψυχαγωγία & τεχνική υποστήριξη","DJ & music":"DJ & μουσική","Live music":"Ζωντανή μουσική","Sound & lighting":"Ήχος & φωτισμός","Photography & video":"Φωτογραφία & βίντεο","Extra touches":"Ξεχωριστές λεπτομέρειες","Invitations & stationery":"Προσκλητήρια & είδη γραφείου","Wedding cake":"Γαμήλια τούρτα","Guest experiences":"Εμπειρίες για τους καλεσμένους","Children's entertainment":"Παιδική ψυχαγωγία","Continue":"Συνέχεια","Preferred event date":"Επιθυμητή ημερομηνία","Approximate number of guests":"Εκτιμώμενος αριθμός καλεσμένων","e.g. 120":"π.χ. 120","Your name":"Το όνομά σας","Full name":"Ονοματεπώνυμο","Email address":"Διεύθυνση email","Phone number":"Τηλέφωνο","+30 ...":"+30 ...","Tell us a little more":"Πείτε μας λίγα περισσότερα","Your ideas, preferred location, style, budget range or anything else...":"Οι ιδέες σας, η τοποθεσία, το στυλ, το ενδεικτικό budget ή οτιδήποτε άλλο...","Your event selection":"Οι επιλογές της εκδήλωσής σας","No services selected yet":"Δεν έχετε επιλέξει ακόμη υπηρεσίες","Back":"Πίσω","Send my enquiry":"Αποστολή αιτήματος","Not specified":"Δεν έχει οριστεί","WhatsApp will open with your event details and selected services ready to send.":"Το WhatsApp θα ανοίξει με τα στοιχεία της εκδήλωσής σας και τις επιλεγμένες υπηρεσίες, έτοιμα για αποστολή.","Sending your enquiry...":"Αποστολή του αιτήματός σας...","Your enquiry has been sent successfully. We will contact you soon.":"Το αίτημά σας στάλθηκε με επιτυχία. Θα επικοινωνήσουμε σύντομα μαζί σας.","We could not send your enquiry. Please try again or contact us directly.":"Δεν ήταν δυνατή η αποστολή του αιτήματός σας. Δοκιμάστε ξανά ή επικοινωνήστε απευθείας μαζί μας.","Please enter your name and a valid email address.":"Παρακαλώ συμπληρώστε το όνομά σας και μια έγκυρη διεύθυνση email.","A glimpse of the possibilities":"Μια ματιά στις δυνατότητες","Moments, beautifully made.":"Στιγμές, μοναδικά δημιουργημένες.","Visit our Facebook":"Επισκεφθείτε τη σελίδα μας στο Facebook","A selection of real moments from Greatest Moments Events.":"Μια επιλογή από πραγματικές στιγμές της Greatest Moments Events.","Let's make it memorable":"Ας δημιουργήσουμε αξέχαστες στιγμές","We'd love to hear":"Θα χαρούμε να ακούσουμε","what you're dreaming of.":"τι ονειρεύεστε.","Tell us about your occasion and let's start planning something special.":"Μιλήστε μας για την περίστασή σας και ας ξεκινήσουμε να σχεδιάζουμε κάτι ξεχωριστό.","Call us":"Καλέστε μας","Visit us":"Επισκεφθείτε μας","Follow our work":"Ακολουθήστε τη δουλειά μας","Get directions":"Οδηγίες πρόσβασης","Website customisation":"Προσαρμογή ιστοσελίδας","Photo editor":"Επεξεργασία φωτογραφιών","Choose images from your device to preview them in the matching sections of this website.":"Επιλέξτε εικόνες από τη συσκευή σας για να τις δείτε στις αντίστοιχες ενότητες της ιστοσελίδας.","Homepage hero":"Κεντρική εικόνα αρχικής σελίδας","About section / table styling":"Ενότητα «Σχετικά» / διακόσμηση τραπεζιού","Event planning card":"Κάρτα οργάνωσης εκδηλώσεων","Food & catering card":"Κάρτα φαγητού & catering","Music & entertainment card":"Κάρτα μουσικής & ψυχαγωγίας","Choose image":"Επιλογή εικόνας","Custom local preview":"Προσαρμοσμένη τοπική προεπισκόπηση","Using current website image":"Χρήση τρέχουσας εικόνας ιστοσελίδας","Please choose an image file.":"Παρακαλώ επιλέξτε ένα αρχείο εικόνας.","This image could not be processed. Please try another file.":"Δεν ήταν δυνατή η επεξεργασία αυτής της εικόνας. Δοκιμάστε ένα άλλο αρχείο.","Photo added to your local preview draft.":"Η φωτογραφία προστέθηκε στην τοπική προεπισκόπηση.","Browser storage is full. Restore the photo draft or use a smaller image.":"Ο αποθηκευτικός χώρος του browser είναι πλήρης. Επαναφέρετε τις φωτογραφίες ή χρησιμοποιήστε μικρότερη εικόνα.","This image could not be opened. Please try another file.":"Δεν ήταν δυνατό να ανοίξει αυτή η εικόνα. Δοκιμάστε ένα άλλο αρχείο.","Original demo photos restored in this browser.":"Οι αρχικές δοκιμαστικές φωτογραφίες επαναφέρθηκαν σε αυτόν τον browser.","Close photo editor":"Κλείσιμο επεξεργασίας φωτογραφιών","Restore original photos":"Επαναφορά αρχικών φωτογραφιών","Done":"Ολοκλήρωση","Important: this is a local preview editor. Your choices are saved only in this browser on this device; they do not change the published website for other visitors. Publishing permanent changes requires a connected website media library/CMS or an update to the site source.":"Σημαντικό: αυτό το εργαλείο επεξεργάζεται μόνο την τοπική προεπισκόπηση. Οι επιλογές σας αποθηκεύονται μόνο σε αυτόν τον browser και σε αυτή τη συσκευή· δεν αλλάζουν τη δημοσιευμένη ιστοσελίδα για άλλους επισκέπτες. Για μόνιμες αλλαγές απαιτείται ενημέρωση του κώδικα της ιστοσελίδας.","All rights reserved.":"Με επιφύλαξη παντός δικαιώματος.","Chat on WhatsApp":"Συνομιλία στο WhatsApp","Wedding":"Γάμος","Christening":"Βάπτιση","Birthday party":"Πάρτι γενεθλίων","Private celebration":"Ιδιωτική εκδήλωση","Corporate event":"Εταιρική εκδήλωση","Other":"Άλλο"};
const tr = (value: string, language: "en" | "el") => language === "el" ? (translations[value] ?? value) : value;
const Translate = ({ language, children }: { language: "en" | "el"; children: React.ReactNode }) => {
  const translateTree = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") return tr(node, language);
    if (Array.isArray(node)) return node.map((child, index) => <React.Fragment key={index}>{translateTree(child)}</React.Fragment>);
    if (React.isValidElement(node)) {
      const props = node.props as Record<string, unknown>;
      const nextProps: Record<string, unknown> = {};
      for (const key of ["alt", "placeholder", "aria-label", "title"]) {
        if (typeof props[key] === "string") nextProps[key] = tr(props[key] as string, language);
      }
      nextProps.children = translateTree(props.children as React.ReactNode);
      return React.cloneElement(node, nextProps);
    }
    return node;
  };
  return <>{translateTree(children)}</>;
};

const galleryPhotos = ["https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/500508195_705075108940858_401589156901303794_n.jpg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/897548181_1144479411667090_484768408725024703_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/898293090_1145879241527107_6343229123553735420_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/899334167_1146586461456385_838250300755801108_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/899546127_1146489011466130_329473913308439945_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/899587892_1146586471456384_5664073357326747841_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/900732369_1146485444799820_8151368158037087807_n.jpeg", "https://raw.githubusercontent.com/Dennis200207/Greatest-Moments-Events/main/assets/images/901173892_1146489034799461_7127952366461423116_n.jpeg"];
const photos = {
  hero: galleryPhotos[0],
  wedding: galleryPhotos[1],
  table: galleryPhotos[2],
  food: galleryPhotos[3],
  party: galleryPhotos[4]
};
const serviceGroups = [{
  title: "Planning & coordination",
  items: ["Full event planning", "Day-of coordination", "Venue selection"]
}, {
  title: "Food & drinks",
  items: ["Wedding catering", "Buffet & finger food", "Dessert table", "Open bar & cocktails"]
}, {
  title: "Design & styling",
  items: ["Floral design", "Table styling", "Wedding backdrop", "Themed decoration"]
}, {
  title: "Entertainment & production",
  items: ["DJ & music", "Live music", "Sound & lighting", "Photography & video"]
}, {
  title: "Extra touches",
  items: ["Invitations & stationery", "Wedding cake", "Guest experiences", "Children's entertainment"]
}];
const events = ["Wedding", "Christening", "Birthday party", "Private celebration", "Corporate event", "Other"];
type SitePage = "home" | "about" | "services" | "gallery" | "contact" | "plan" | "admin";
const getPageFromHash = (): SitePage => {
  const candidate = window.location.hash.replace(/^#\/?/, "") as SitePage;
  return (["home", "about", "services", "gallery", "contact", "plan", "admin"] as SitePage[]).includes(candidate) ? candidate : "home";
};

export const GreatestMomentsEventsWebsite = () => {
  const [eventType, setEventType] = useState("Wedding");
  const [selected, setSelected] = useState(["Full event planning"]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    guests: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">("");
  const [language, setLanguage] = useState<"en" | "el">(() => localStorage.getItem("greatest-moments-language") === "el" ? "el" : "en");
  useEffect(() => { localStorage.setItem("greatest-moments-language", language); document.documentElement.lang = language; }, [language]);
  const [page, setPage] = useState<SitePage>(() => getPageFromHash());
  useEffect(() => {
    const syncPage = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", syncPage);
    if (!window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search + "#/home");
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);
  const [imageOverrides, setImageOverrides] = useState({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [uploadNotice, setUploadNotice] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("greatest-moments-photo-draft");
      if (saved) setImageOverrides(JSON.parse(saved));
    } catch {}
  }, []);
  const images = {
    ...photos,
    ...imageOverrides
  };
  const imageSlots = [["hero", "Homepage hero"], ["table", "About section / table styling"], ["wedding", "Event planning card"], ["food", "Food & catering card"], ["party", "Music & entertainment card"]];
  const handleImageUpload = (key, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadNotice("Please choose an image file.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const preview = new Image();
    preview.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / preview.width, 1200 / preview.height);
      canvas.width = Math.round(preview.width * scale);
      canvas.height = Math.round(preview.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        setUploadNotice("This image could not be processed. Please try another file.");
        return;
      }
      context.drawImage(preview, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(objectUrl);
        if (!blob) {
          setUploadNotice("This image could not be processed. Please try another file.");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const next = {
            ...imageOverrides,
            [key]: String(reader.result)
          };
          try {
            localStorage.setItem("greatest-moments-photo-draft", JSON.stringify(next));
            setImageOverrides(next);
            setUploadNotice("Photo added to your local preview draft.");
          } catch {
            setUploadNotice("Browser storage is full. Restore the photo draft or use a smaller image.");
          }
        };
        reader.readAsDataURL(blob);
      }, "image/webp", 0.78);
    };
    preview.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setUploadNotice("This image could not be opened. Please try another file.");
    };
    preview.src = objectUrl;
  };
  const resetImageDraft = () => {
    localStorage.removeItem("greatest-moments-photo-draft");
    setImageOverrides({});
    setUploadNotice("Original demo photos restored in this browser.");
  };
  const toggle = item => setSelected(old => old.includes(item) ? old.filter(x => x !== item) : [...old, item]);
  const summary = useMemo(() => serviceGroups.map(g => ({
    ...g,
    items: g.items.filter(i => selected.includes(i))
  })).filter(g => g.items.length), [selected]);
  const submitEnquiry = async () => {
    if (!form.name.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.trim())) {
      setSubmitStatus("error");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("");
    const payload = {
      _subject: `New website enquiry — ${eventType}`,
      _replyto: form.email.trim(),
      _template: "table",
      "Event": eventType,
      "Preferred event date": form.date || "Not specified",
      "Approximate number of guests": form.guests || "Not specified",
      "Selected services": selected.join(", ") || "None selected",
      "Visitor name": form.name.trim(),
      "Visitor email": form.email.trim(),
      "Visitor phone": form.phone.trim() || "Not provided",
      "Additional notes": form.notes.trim() || "None",
      "Website": window.location.href
    };
    try {
      const response = await fetch("https://formsubmit.co/ajax/panagiotopoulou_evangelie@yahoo.gr", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === "true")) {
        throw new Error(result.message || "Submission failed");
      }
      setSent(true);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const update = (key, value) => setForm(old => ({
    ...old,
    [key]: value
  }));
  return <Translate language={language}><div className="min-h-screen bg-[#faf8f4] text-[#24231f]">
      <div className="bg-[#26251f] px-5 py-2 text-center text-[10px] tracking-[.24em] text-[#e8d9bd] sm:text-xs">CREATING MOMENTS THAT LAST A LIFETIME · ATHENS, GREECE</div>
      <header className="sticky top-0 z-40 border-b border-[#e9e3d9] bg-[#faf8f4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#/home" className="leading-tight"><span className="block font-serif text-2xl tracking-[.12em]">GREATEST MOMENTS</span><span className="mt-1 block text-center text-[9px] tracking-[.48em] text-[#a17d4e]">EVENTS · CATERING · DESIGN</span></a>
          <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[.14em] md:flex"><a className={`hover:text-[#a17d4e] ${page === "about" ? "text-[#a17d4e]" : ""}`} href="#/about">Our story</a><a className={`hover:text-[#a17d4e] ${page === "services" ? "text-[#a17d4e]" : ""}`} href="#/services">Services</a><a className={`hover:text-[#a17d4e] ${page === "gallery" ? "text-[#a17d4e]" : ""}`} href="#/gallery">Gallery</a><a className={`hover:text-[#a17d4e] ${page === "contact" ? "text-[#a17d4e]" : ""}`} href="#/contact">Contact</a></nav>
          <div className="flex shrink-0 items-center gap-1 border border-[#e5ded3] p-1 text-[10px] tracking-wider" aria-label="Language selector"><button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`px-2 py-2 transition ${language === "en" ? "bg-[#292720] text-white" : "text-[#777168] hover:text-[#a17d4e]"}`}>EN</button><button type="button" onClick={() => setLanguage("el")} aria-pressed={language === "el"} className={`px-2 py-2 transition ${language === "el" ? "bg-[#292720] text-white" : "text-[#777168] hover:text-[#a17d4e]"}`}>ΕΛ</button></div>
          <a href="#/plan" className="border border-[#a17d4e] px-4 py-3 text-[10px] uppercase tracking-[.16em] transition hover:bg-[#a17d4e] hover:text-white">Plan your event <span aria-hidden>↗</span></a>
        </div>
        <nav className="flex gap-5 overflow-x-auto border-t border-[#e9e3d9] px-5 py-3 text-[9px] uppercase tracking-[.14em] md:hidden"><a className="whitespace-nowrap" href="#/about">Our story</a><a className="whitespace-nowrap" href="#/services">Services</a><a className="whitespace-nowrap" href="#/gallery">Gallery</a><a className="whitespace-nowrap" href="#/contact">Contact</a></nav>
      </header>

      <main>
        {page === "home" && (<section id="home" className="relative min-h-[680px] overflow-hidden bg-[#27251f]">
          <img src={images.hero} alt="Romantic wedding reception with elegant floral styling" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171713]/80 via-[#171713]/35 to-transparent" />
          <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-24 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="mb-7 text-[10px] uppercase tracking-[.36em] text-[#e5cda9]">Your vision. Our creation.</p>
              <h1 className="font-serif text-5xl leading-[1.08] sm:text-7xl">Every detail.<br /><em className="font-normal text-[#e5cda9]">A moment to remember.</em></h1>
              <p className="mt-7 max-w-lg text-sm leading-7 text-white/85 sm:text-base">From beautifully considered weddings to unforgettable celebrations, we bring people, flavours and thoughtful design together.</p>
              <div className="mt-10 flex flex-wrap gap-4"><a href="#/plan" className="bg-[#b18b5c] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white transition hover:bg-[#987346]">Create your event <span aria-hidden>↗</span></a><a href="#/services" className="border border-white/60 px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-white/10">Discover our services</a></div>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 hidden text-right text-[9px] uppercase tracking-[.28em] text-white/75 md:block">Made with care · Celebrated forever</div>
        </section>)} 

        {page === "about" && (<section id="about" className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">The art of bringing people together</p><h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">More than an event.<br /><em className="text-[#a17d4e]">A feeling that stays.</em></h2><p className="mt-7 max-w-xl text-sm leading-8 text-[#6f6a61]">At Greatest Moments Events, we believe the most memorable celebrations are made from the details: a welcoming table, a beautiful setting, exceptional food and the people you love. We bring the elements together around your ideas and your occasion.</p><a href="#/contact" className="mt-8 inline-flex border-b border-[#a17d4e] pb-2 text-[10px] uppercase tracking-[.2em]">Let's create something beautiful <span className="ml-3">↗</span></a></div>
          <div className="relative"><img src={images.table} alt="Elegant event tablescape" className="h-[440px] w-full object-cover" /><div className="absolute -bottom-6 -left-5 bg-[#eee7dc] px-8 py-6 sm:-left-8"><span className="font-serif text-3xl italic text-[#9c784d]">Your day,</span><span className="mt-1 block text-[9px] uppercase tracking-[.2em]">beautifully brought to life</span></div></div>
        </section>)} 

        {page === "services" && (<section id="services" className="bg-[#f0ece5] px-6 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-xl text-center"><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">What we do</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">One team. Every detail.</h2><p className="mt-5 text-sm leading-7 text-[#777168]">A considered collection of services, brought together around the celebration you imagine.</p></div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              n: "01",
              t: "Event planning",
              d: "From the first idea to the final toast, every moment thoughtfully coordinated.",
              img: images.wedding
            }, {
              n: "02",
              t: "Food & catering",
              d: "Delicious menus, beautifully presented, made for sharing and celebrating.",
              img: images.food
            }, {
              n: "03",
              t: "Design & styling",
              d: "Atmosphere, flowers, tables and details that make the occasion yours.",
              img: images.table
            }, {
              n: "04",
              t: "Music & entertainment",
              d: "The right soundtrack, production and energy for an unforgettable gathering.",
              img: images.party
            }].map(c => <article key={c.n} className="group bg-[#faf8f4]"><div className="overflow-hidden"><img src={c.img} alt={c.t} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><span className="text-[10px] tracking-[.2em] text-[#a17d4e]">{c.n} / GREATEST MOMENTS</span><h3 className="mt-3 font-serif text-2xl">{c.t}</h3><p className="mt-3 text-xs leading-6 text-[#777168]">{c.d}</p></div></article>)}
          </div></div></section>)} 

        {page === "plan" && (<section id="builder" className="scroll-mt-24 px-6 py-24 lg:px-8"><div className="mx-auto max-w-5xl"><div className="text-center"><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">Your celebration starts here</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Build your event</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777168]">Tell us what you have in mind. Choose only the services you need and we'll help you shape the rest.</p></div>
          <div className="mt-12 border border-[#e5ded3] bg-white p-6 sm:p-10">
            <div className="mb-10 flex items-center justify-between"><div><span className="text-[10px] uppercase tracking-[.2em] text-[#a17d4e]">Step {step} of 2</span><h3 className="mt-2 font-serif text-2xl">{step === 1 ? "What are we celebrating?" : "A few details about your day"}</h3></div><div className="flex gap-2"><span className={`h-1 w-12 ${step >= 1 ? "bg-[#a17d4e]" : "bg-[#e7e1d8]"}`} /><span className={`h-1 w-12 ${step >= 2 ? "bg-[#a17d4e]" : "bg-[#e7e1d8]"}`} /></div></div>
            {step === 1 ? <div><p className="mb-4 text-xs uppercase tracking-[.15em] text-[#777168]">Choose your occasion</p><div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">{events.map(e => <button type="button" key={e} onClick={() => setEventType(e)} className={`border px-4 py-4 text-left text-sm transition ${eventType === e ? "border-[#a17d4e] bg-[#f5f0e8] text-[#8e6b43]" : "border-[#e7e1d8] hover:border-[#b99a73]"}`}><span className="mr-2">{eventType === e ? "◉" : "○"}</span>{e}</button>)}</div>
              <p className="mb-5 text-xs uppercase tracking-[.15em] text-[#777168]">Select the services you're interested in</p><div className="space-y-7">{serviceGroups.map(g => <div key={g.title}><h4 className="mb-3 font-serif text-xl">{g.title}</h4><div className="grid gap-2 sm:grid-cols-2">{g.items.map(item => <label key={item} className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition ${selected.includes(item) ? "border-[#b18b5c] bg-[#f7f2ea]" : "border-[#e9e3d9] hover:border-[#b99a73]"}`}><input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} className="h-4 w-4 accent-[#a17d4e]" />{item}</label>)}</div></div>)}</div><div className="mt-10 flex justify-end"><button onClick={() => setStep(2)} className="bg-[#292720] px-8 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#a17d4e]">Continue <span className="ml-3">→</span></button></div>
            </div> : <div><div className="mb-8 grid gap-5 sm:grid-cols-2"><label className="text-xs text-[#777168]">Preferred event date<input type="date" value={form.date} onChange={e => update("date", e.target.value)} className="mt-2 block w-full border border-[#e7e1d8] bg-white px-4 py-3 text-sm text-[#24231f]" /></label><label className="text-xs text-[#777168]">Approximate number of guests<input value={form.guests} onChange={e => update("guests", e.target.value)} placeholder="e.g. 120" className="mt-2 block w-full border border-[#e7e1d8] px-4 py-3 text-sm" /></label><label className="text-xs text-[#777168]">Your name<input required value={form.name} onChange={e => update("name", e.target.value)} placeholder="Full name" className="mt-2 block w-full border border-[#e7e1d8] px-4 py-3 text-sm" /></label><label className="text-xs text-[#777168]">Email address<input required type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" className="mt-2 block w-full border border-[#e7e1d8] px-4 py-3 text-sm" /></label><label className="text-xs text-[#777168] sm:col-span-2">Phone number<input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+30 ..." className="mt-2 block w-full border border-[#e7e1d8] px-4 py-3 text-sm" /></label><label className="text-xs text-[#777168] sm:col-span-2">Tell us a little more<textarea rows={4} value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Your ideas, preferred location, style, budget range or anything else..." className="mt-2 block w-full border border-[#e7e1d8] px-4 py-3 text-sm" /></label></div>
              <div className="mb-8 bg-[#f5f1ea] p-5"><p className="text-[10px] uppercase tracking-[.2em] text-[#a17d4e]">Your event selection</p><p className="mt-2 font-serif text-xl">{eventType}</p><div className="mt-3 flex flex-wrap gap-2">{selected.length ? selected.map(s => <span key={s} className="bg-white px-3 py-2 text-xs">{s}</span>) : <span className="text-xs text-[#777168]">No services selected yet</span>}</div></div>
              <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="border border-[#d9d1c5] px-7 py-4 text-[10px] uppercase tracking-[.2em] disabled:opacity-50">← Back</button><button type="button" onClick={submitEnquiry} disabled={isSubmitting || sent} className="bg-[#a17d4e] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#87643e] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Sending..." : sent ? "Enquiry sent ✓" : "Send my enquiry ↗"}</button></div>{submitStatus && <p role="status" aria-live="polite" className={`mt-4 border p-4 text-xs leading-6 ${submitStatus === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{submitStatus === "success" ? "Your enquiry has been sent successfully. We will contact you soon." : (!form.name.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.trim()) ? "Please enter your name and a valid email address." : "We could not send your enquiry. Please try again or contact us directly.")}</p>}<p className="mt-4 text-[10px] leading-5 text-[#918a80]">Your enquiry details will be emailed directly to our events team.</p>
            </div>}
          </div>
        </div></section>)} 

        {page === "gallery" && <GalleryExperience page="gallery" language={language} />}
        {page === "admin" && <GalleryExperience page="admin" language={language} />}

        {page === "contact" && (<section id="contact" className="px-6 py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">Let's make it memorable</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">We'd love to hear<br /><em className="text-[#a17d4e]">what you're dreaming of.</em></h2><p className="mt-6 max-w-md text-sm leading-7 text-[#777168]">Tell us about your occasion and let's start planning something special.</p></div><div className="space-y-6 border-l border-[#e7e1d8] pl-0 md:pl-10"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#a17d4e]">Call us</p><a href="tel:+306977955583" className="mt-2 block font-serif text-2xl">+30 697 795 5583</a></div><div><p className="text-[9px] uppercase tracking-[.2em] text-[#a17d4e]">Visit us</p><p className="mt-2 font-serif text-xl">Aristotelous 6, Agioi Anargyroi<br />135 62, Athens, Greece</p></div><div><p className="text-[9px] uppercase tracking-[.2em] text-[#a17d4e]">Follow our work</p><a href="https://www.facebook.com/greatestmomentsevents" target="_blank" rel="noreferrer" className="mt-2 inline-block font-serif text-xl underline decoration-[#b18b5c] underline-offset-4">Facebook ↗</a></div><a href="https://www.google.com/maps/search/?api=1&query=Aristotelous+6+Agioi+Anargyroi+13562+Greece" target="_blank" rel="noreferrer" className="inline-block bg-[#292720] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#a17d4e]">Get directions ↗</a></div></div></section>)} 
      </main>

      {editorOpen && <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#171713]/75 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Photo editor">
        <div className="mx-auto my-8 max-w-3xl bg-[#faf8f4] p-6 shadow-2xl sm:p-10">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#a17d4e]">Website customisation</p><h2 className="mt-2 font-serif text-3xl">Photo editor</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#777168]">Choose images from your device to preview them in the matching sections of this website.</p></div><button onClick={() => setEditorOpen(false)} aria-label="Close photo editor" className="border border-[#ded6ca] px-3 py-2 text-xl">×</button></div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {imageSlots.map(([key, label]) => <div key={key} className="border border-[#e5ded3] bg-white p-4">
              <p className="mb-3 text-xs font-medium">{label}</p><img src={images[key]} alt={label + " preview"} className="h-36 w-full object-cover" />
              <label className="mt-3 block cursor-pointer border border-[#b18b5c] px-4 py-3 text-center text-[10px] uppercase tracking-[.15em] hover:bg-[#f5f0e8]">Choose image<input type="file" accept="image/*" className="sr-only" onChange={e => handleImageUpload(key, e.target.files?.[0])} /></label>
              <p className="mt-2 text-[10px] text-[#918a80]">{imageOverrides[key] ? "Custom local preview" : "Using current website image"}</p>
            </div>)}
          </div>
          {uploadNotice && <p className="mt-5 border border-[#e5ded3] bg-white p-3 text-xs text-[#6f6a61]" role="status">{uploadNotice}</p>}
          <div className="mt-7 flex flex-wrap justify-between gap-3"><button onClick={resetImageDraft} className="border border-[#d9d1c5] px-5 py-3 text-[10px] uppercase tracking-[.15em]">Restore original photos</button><button onClick={() => setEditorOpen(false)} className="bg-[#292720] px-6 py-3 text-[10px] uppercase tracking-[.15em] text-white">Done</button></div>
          <p className="mt-5 text-[10px] leading-5 text-[#918a80]">Important: this is a local preview editor. Your choices are saved only in this browser on this device; they do not change the published website for other visitors. Publishing permanent changes requires a connected website media library/CMS or an update to the site source.</p>
        </div>
      </div>}
      <footer className="bg-[#26251f] px-6 py-8 text-center text-white/60"><p className="font-serif text-xl tracking-[.12em] text-white">GREATEST MOMENTS</p><p className="mt-2 text-[9px] uppercase tracking-[.3em]">Events · Catering · Design</p><p className="mt-5 text-[10px]">© {new Date().getFullYear()} Greatest Moments Events. All rights reserved.</p><div className="mt-4 flex justify-center gap-5"><button onClick={() => setEditorOpen(true)} className="border-b border-[#b18b5c] pb-1 text-[9px] uppercase tracking-[.2em] text-[#e5cda9]">Photo editor</button><a href="#/admin" className="border-b border-white/20 pb-1 text-[9px] uppercase tracking-[.2em] text-white/40">Admin</a></div></footer>
      <a href="https://wa.me/306977955583" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#a17d4e] text-xl text-white shadow-xl transition hover:scale-105">✆</a>
    </div></Translate>;
};