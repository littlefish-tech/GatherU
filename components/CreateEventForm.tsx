"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  organizer: string;
  agenda: string;
  tags: string;
};

const initialState: FormState = {
  title: "",
  description: "",
  overview: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "offline",
  audience: "",
  organizer: "",
  agenda: "",
  tags: "",
};

export default function CreateEventForm() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (!imageFile) {
        throw new Error("Please choose an image file");
      }

      const formData = new FormData();

      // Keep simple text fields and structured list fields in the same submission.
      Object.entries(form).forEach(([key, value]) => {
        if (key === "agenda" || key === "tags") {
          const items = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

          formData.append(key, JSON.stringify(items));
          return;
        }

        formData.append(key, value);
      });

      formData.append("imageFile", imageFile);

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create event");
      }

      setMessage("Event created successfully.");
      setForm(initialState);
      setImageFile(null);
      // File inputs do not reset from React state alone.
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      if (data.event?.slug) {
        // Send the user straight to the newly created event once the write succeeds.
        router.push(`/events/${data.event.slug}`);
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create event",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(148,234,255,0.18),_transparent_38%),linear-gradient(180deg,_rgba(16,24,32,0.9),_rgba(8,13,19,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8 md:p-10">
        <div className="mb-8 max-w-3xl space-y-3">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-light-100">
            Campus Publishing
          </span>
          <h1 className="text-left">Create Event</h1>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm sm:p-6 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Event Title
              </span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Spring React Meetup"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Event Image
              </span>
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white file:mr-4 file:rounded-full file:border-0 file:bg-cyan-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-white"
                required
              />
              <small className="text-xs text-light-100/60">
                Select an image from your computer.
              </small>
              {imageFile ? (
                <small className="text-xs text-cyan-100/80">
                  Selected: {imageFile.name}
                </small>
              ) : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Venue Name
              </span>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Innovation Hall or Student Center"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                City or Campus
              </span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="San Francisco campus or Downtown SF"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Date
              </span>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Start Time
              </span>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Event Format
              </span>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Who Is This For?
              </span>
              <input
                name="audience"
                value={form.audience}
                onChange={handleChange}
                placeholder="Students, alumni, founders, or first-time attendees"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Organizer
              </span>
              <input
                name="organizer"
                value={form.organizer}
                onChange={handleChange}
                placeholder="GatherU Team"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Topics
              </span>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, networking, design, career growth"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Short Summary
              </span>
              <textarea
                name="overview"
                value={form.overview}
                onChange={handleChange}
                placeholder="A quick one- or two-sentence summary people see before opening the event."
                className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Full Description
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Share the full event details, speaker context, what attendees can expect, and anything they should bring."
                className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[0.02em] text-light-100">
                Agenda
              </span>
              <textarea
                name="agenda"
                value={form.agenda}
                onChange={handleChange}
                placeholder="Check-in, opening talk, panel, networking"
                className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-[rgba(231,242,255,0.36)] focus:border-cyan-200/60 focus:bg-white/8 focus:ring-4 focus:ring-cyan-200/10"
                required
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {message ? (
              <p className="text-sm text-light-100/85">{message}</p>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-40 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(148,234,255,0.25)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
