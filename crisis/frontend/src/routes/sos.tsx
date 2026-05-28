import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, MapPin, Mic, Phone, Siren, Users, Video } from "lucide-react";

const types = ["Flood", "Fire", "Earthquake", "Accident", "Medical", "Other"];

type LocationState = {
  lat: number;
  lon: number;
} | null;

export function SOSPage() {
  const [type, setType] = useState("Flood");
  const [medical, setMedical] = useState(false);
  const [location, setLocation] = useState<LocationState>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback or user notification
        },
      );
    }
  }, []);

  const handlePhoto = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
          // You can add a button to capture a frame to a canvas
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };

  const handleVoice = async () => {
    if (isRecording) {
      mediaRecorder?.stop();
      setIsRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          recorder.start();
          setIsRecording(true);

          const chunks: Blob[] = [];
          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            // Here you would send the blob to the server/analyzer
          };
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      }
    }
  };

  const handleVideo = async () => {
    // Similar to handleVoice, but with video: true
    alert("Video recording not implemented yet.");
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <header className="border-b border-white/5 bg-navy-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-mono font-bold tracking-tighter">
            SENTINEL<span className="text-critical">.</span>OS
          </Link>
          <a
            href="tel:911"
            className="inline-flex items-center gap-2 text-critical text-sm font-bold"
          >
            <Phone className="size-4" /> Call 911
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-critical/10 border border-critical/20 mb-4">
          <span className="size-1.5 rounded-full bg-critical animate-pulse-critical" />
          <span className="text-[10px] font-mono font-bold text-critical uppercase tracking-wider">
            Emergency Channel · Encrypted
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-2">
          Report Emergency
        </h1>
        <p className="text-muted-foreground mb-8 text-pretty">
          Send a one-tap distress signal. AI will triage urgency and route the nearest response
          unit. Stay calm — help is dispatched the moment you submit.
        </p>

        <button className="w-full mb-8 p-6 bg-critical hover:brightness-110 transition-all rounded-lg flex items-center justify-center gap-3 text-white font-bold text-lg uppercase tracking-widest">
          <Siren className="size-6 animate-pulse-critical" />
          Panic SOS · Send Now
        </button>

        <form className="space-y-6 bg-navy-900 border border-white/5 rounded-lg p-6">
          <Field label="Full Name">
            <input
              className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking"
              placeholder="Your name"
            />
          </Field>
          <Field label="Mobile Number">
            <input
              className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking"
              placeholder="+1 555 0123"
            />
          </Field>

          <Field label="Emergency Type">
            <div className="grid grid-cols-3 gap-2">
              {types.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-widest border transition-all ${
                    type === t
                      ? "border-critical bg-critical/10 text-critical"
                      : "border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking resize-none"
              placeholder="Briefly describe the situation..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="GPS Location">
              <button
                type="button"
                className="w-full px-3 py-2.5 bg-navy-950 border border-tracking/30 text-tracking rounded-md text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 hover:bg-tracking/10"
              >
                <MapPin className="size-3.5" />{" "}
                {location
                  ? `Locked: ${location.lat.toFixed(2)}° N, ${location.lon.toFixed(2)}° W`
                  : "Acquiring..."}
              </button>
            </Field>
            <Field label="Victims (#)">
              <input
                type="number"
                defaultValue={1}
                className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking"
              />
            </Field>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handlePhoto}
              className="p-3 bg-navy-950 border border-white/10 rounded-md flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-tracking/40"
            >
              <Camera className="size-5" /> Photo
            </button>
            <button
              type="button"
              onClick={handleVoice}
              className={`p-3 bg-navy-950 border rounded-md flex flex-col items-center gap-2 text-xs font-medium transition-colors ${
                isRecording
                  ? "border-critical text-critical"
                  : "border-white/10 text-muted-foreground hover:text-foreground hover:border-tracking/40"
              }`}
            >
              <Mic className="size-5" /> {isRecording ? "Stop" : "Voice"}
            </button>
            <button
              type="button"
              onClick={handleVideo}
              className="p-3 bg-navy-950 border border-white/10 rounded-md flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-tracking/40"
            >
              <Video className="size-5" /> Video
            </button>
            <button
              type="button"
              className="p-3 bg-navy-950 border border-white/10 rounded-md flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-tracking/40"
            >
              <Users className="size-5" /> Group
            </button>
          </div>

          {audioUrl && (
            <Field label="Recorded Audio">
              <audio controls src={audioUrl} className="w-full" />
            </Field>
          )}

          <video ref={videoRef} className="w-full rounded-md" style={{ display: "none" }} />


          <label className="flex items-center justify-between p-4 bg-navy-950 border border-white/10 rounded-md cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-warning" />
              <div>
                <div className="text-sm font-bold">Medical Emergency</div>
                <div className="text-[10px] text-muted-foreground">
                  Dispatch ambulance + paramedic
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMedical(!medical)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                medical ? "bg-critical" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                  medical ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          <div className="p-4 bg-tracking/10 border border-tracking/20 rounded-md">
            <div className="text-[10px] font-mono uppercase tracking-widest text-tracking font-bold mb-1">
              AI Auto-Summary
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              "{type} incident reported in coastal sector. Estimated urgency:{" "}
              <span className="text-critical font-bold">HIGH</span>. Duplicate check passed.
              Translation: EN."
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-4 bg-critical text-white text-sm font-bold uppercase tracking-widest rounded-md hover:brightness-110 transition-all inline-flex items-center justify-center gap-2"
          >
            <Siren className="size-4" /> Submit Distress Signal
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
