const promptPreset = `Create a high-energy psytrance track at 148 BPM.

Structure:
- Cinematic intro
- Build-up
- Massive drop
- Breakdown
- Final explosive drop

Intro:
Deep spiritual atmosphere with ambient pads and cinematic tension.
Start with a clear male vocal chant in Hebrew:
"עזרנו אלוקי ישעינו על דבר כבוד שמך והצילינו וכפר על חטאותינו למען שמך"

Drop:
Aggressive rolling psytrance bassline, powerful kick, acid leads, festival energy.

Throughout the track:
Use rhythmic chopped vocal samples of:
"עזרנו אלוקי ישעינו"
"והצילינו וכפר על חטאותינו"
"למען שמך"

Production:
Modern, clean, loud, festival-level mastering.`;

const statusEl = document.getElementById("status");
const audio = document.getElementById("player");
const download = document.getElementById("download");

document.getElementById("loadPrompt").onclick = () => {
  document.getElementById("prompt").value = promptPreset;
};

document.getElementById("saveKey").onclick = () => {
  const key = document.getElementById("apiKey").value.trim();
  if (!key) return alert("הכנס מפתח");
  localStorage.setItem("gemini_key", key);
  alert("נשמר!");
};

document.getElementById("generate").onclick = async () => {
  const apiKey = localStorage.getItem("gemini_key");
  if (!apiKey) return alert("שמור מפתח קודם");

  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return alert("אין פרומפט");

  statusEl.innerText = "יוצר מוזיקה... זה יכול לקחת זמן ⏳";

  try {
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/lyria-realtime-exp:generate?key=${apiKey}`,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await res.json();

    if (!data.audio) {
      statusEl.innerText = "לא התקבל אודיו (יתכן שהפיצ'ר לא זמין לחשבון).";
      console.log(data);
      return;
    }

    const binary = atob(data.audio);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);

    audio.src = url;
    audio.style.display = "block";

    download.href = url;
    download.download = "psytrance.mp3";
    download.style.display = "inline-block";

    statusEl.innerText = "מוכן!";
  } catch (e) {
    statusEl.innerText = "שגיאה ביצירה.";
    console.error(e);
  }
};
