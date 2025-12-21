"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface Profile {
  fullName: string;
  email: string;
  institution: string;
  department: string;
  researchDomain: string;
  country: string;
  city: string;
  biography: string;
  role: string;
  avatarDataUrl?: string; // optional local preview
}

type FieldKey = keyof Profile;

const initialProfile: Profile = {
  fullName: "Hamza Mouheb Abdelhak",
  email: "mouhebkanye808s@gmail.com",
  institution: "Constantine 2 University",
  department: "Computer Science",
  researchDomain: "Music type shit",
  country: "Algeria",
  city: "Constantine",
  biography: "type shyt",
  role: "student",
  avatarDataUrl: undefined,
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function isValidEmail(email: string) {
  // Simple + practical. Replace with stricter if you want.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function shallowEqualProfile(a: Profile, b: Profile) {
  const keys: FieldKey[] = [
    "fullName",
    "email",
    "institution",
    "department",
    "researchDomain",
    "country",
    "city",
    "biography",
    "role",
    "avatarDataUrl",
  ];
  return keys.every((k) => (a[k] ?? "") === (b[k] ?? ""));
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // persisted profile (what you’d normally load/save from backend)
  const [saved, setSaved] = useState<Profile>(initialProfile);

  // draft profile while editing
  const [draft, setDraft] = useState<Profile>(initialProfile);

  // UI feedback
  const [status, setStatus] = useState<"" | "saved" | "error">("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dirty = useMemo(
    () => !shallowEqualProfile(saved, draft),
    [saved, draft]
  );

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!draft.fullName.trim()) e.fullName = "Full name is required.";
    if (!draft.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(draft.email))
      e.email = "Please enter a valid email.";
    if (!draft.institution.trim()) e.institution = "Institution is required.";
    if (!draft.department.trim()) e.department = "Department is required.";
    if (!draft.country.trim()) e.country = "Country is required.";
    if (!draft.city.trim()) e.city = "City is required.";
    if (draft.biography.trim().length > 500)
      e.biography = "Max 500 characters.";
    return e;
  }, [draft]);

  const canSave = isEditing && dirty && Object.keys(errors).length === 0;

  useEffect(() => {
    // keyboard shortcuts only in edit mode
    const onKeyDown = (ev: KeyboardEvent) => {
      if (!isEditing) return;

      const isSaveCombo =
        (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "s";
      if (isSaveCombo) {
        ev.preventDefault();
        if (canSave) handleSave();
        return;
      }

      if (ev.key === "Escape") {
        ev.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, canSave, draft, saved]);

  const handleEdit = () => {
    setDraft(saved);
    setIsEditing(true);
    setStatus("");
  };

  const handleSave = async () => {
    if (!canSave) return;
    try {
      // TODO: replace with your API call.
      // await fetch("/api/profile", { method: "PUT", body: JSON.stringify(draft) });

      setSaved(draft);
      setIsEditing(false);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleCancel = () => {
    if (dirty) {
      const ok = window.confirm("Discard your changes?");
      if (!ok) return;
    }
    setDraft(saved);
    setIsEditing(false);
    setStatus("");
  };

  const updateField = (field: FieldKey, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setStatus("");
  };

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    // 2MB cap (tweak as you like)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please use a file under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarDataUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const initials = useMemo(() => getInitials(saved.fullName), [saved.fullName]);
  const roleLabel = saved.role?.trim() ? saved.role.trim() : "user";

  const fieldClass =
    "peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed";
  const labelClass = "absolute left-6 top-2 text-xs text-blue-300";

  const errorText = (key: FieldKey) =>
    errors[key] ? (
      <p className="mt-2 text-sm text-red-200/90">{errors[key]}</p>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full space-y-8">
          {/* BACK BUTTON */}
          <button
            type="button"
            className="flex items-center gap-2 text-white/70 hover:text-blue-300 transition-colors -mt-4 mb-4"
            onClick={() => history.back()}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              My
              <br />
              <span className="text-blue-300">Profile</span>
            </h1>
            <p className="text-white/70 mt-2">Manage your account</p>
          </div>

          {/* AVATAR */}
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
              {saved.avatarDataUrl ? (
                <img
                  src={saved.avatarDataUrl}
                  alt={`${saved.fullName} avatar`}
                  className="w-28 h-28 rounded-full object-cover border-2 border-white/30 bg-white/10"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-3xl font-bold">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={isEditing ? onPickAvatar : undefined}
                disabled={!isEditing}
                aria-label="Change avatar"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                title={
                  isEditing ? "Change avatar" : "Click Edit to change avatar"
                }
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onAvatarFile(e.target.files?.[0])
                }
              />
            </div>

            {/* PROFILE NAME */}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {saved.fullName}
              </h2>
              <p className="text-blue-300 mt-1 capitalize">{roleLabel}</p>
              {status === "saved" && (
                <p className="mt-2 text-sm text-emerald-200/90">Saved ✔</p>
              )}
              {status === "error" && (
                <p className="mt-2 text-sm text-red-200/90">
                  Couldn’t save. Try again.
                </p>
              )}
            </div>
          </div>

          {/* Quick tips */}
          {isEditing && (
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-white/80 text-sm">
              <p className="font-semibold text-white mb-1">Shortcuts</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Esc: cancel</li>
                <li>Ctrl/Cmd + S: save</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-2/3 bg-white/5 backdrop-blur-sm p-8 md:p-12 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Personal Information
              </h3>
              {isEditing && (
                <p className="text-white/70 mt-1">
                  {dirty ? "You have unsaved changes." : "No changes yet."}
                </p>
              )}
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors rounded-lg"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  title={
                    !canSave
                      ? "Fix errors and make a change to enable Save"
                      : "Save"
                  }
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-white/10 text-white/80 font-semibold hover:bg-white/20 hover:text-white transition-colors rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-5">
            {/* FULL NAME */}
            <div className="relative">
              <input
                type="text"
                disabled={!isEditing}
                value={draft.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("fullName", e.target.value)
                }
                placeholder="Full Name"
                aria-invalid={!!errors.fullName}
                className={
                  fieldClass +
                  (errors.fullName
                    ? " border-red-300/60 focus:border-red-200"
                    : "")
                }
              />
              <label className={labelClass}>Full Name</label>
              {errorText("fullName")}
            </div>

            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                disabled={!isEditing}
                value={draft.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("email", e.target.value)
                }
                placeholder="Email"
                aria-invalid={!!errors.email}
                className={
                  fieldClass +
                  (errors.email
                    ? " border-red-300/60 focus:border-red-200"
                    : "")
                }
              />
              <label className={labelClass}>Email</label>
              {errorText("email")}
            </div>

            {/* TWO COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution */}
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={draft.institution}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField("institution", e.target.value)
                  }
                  placeholder="Institution"
                  aria-invalid={!!errors.institution}
                  className={
                    fieldClass +
                    (errors.institution
                      ? " border-red-300/60 focus:border-red-200"
                      : "")
                  }
                />
                <label className={labelClass}>Institution</label>
                {errorText("institution")}
              </div>

              {/* Department */}
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={draft.department}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField("department", e.target.value)
                  }
                  placeholder="Department"
                  aria-invalid={!!errors.department}
                  className={
                    fieldClass +
                    (errors.department
                      ? " border-red-300/60 focus:border-red-200"
                      : "")
                  }
                />
                <label className={labelClass}>Department</label>
                {errorText("department")}
              </div>
            </div>

            {/* Research Domain */}
            <div className="relative">
              <input
                type="text"
                disabled={!isEditing}
                value={draft.researchDomain}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("researchDomain", e.target.value)
                }
                placeholder="Research Domain"
                className={fieldClass}
              />
              <label className={labelClass}>Research Domain</label>
            </div>

            {/* COUNTRY + CITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={draft.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField("country", e.target.value)
                  }
                  placeholder="Country"
                  aria-invalid={!!errors.country}
                  className={
                    fieldClass +
                    (errors.country
                      ? " border-red-300/60 focus:border-red-200"
                      : "")
                  }
                />
                <label className={labelClass}>Country</label>
                {errorText("country")}
              </div>

              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={draft.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField("city", e.target.value)
                  }
                  placeholder="City"
                  aria-invalid={!!errors.city}
                  className={
                    fieldClass +
                    (errors.city
                      ? " border-red-300/60 focus:border-red-200"
                      : "")
                  }
                />
                <label className={labelClass}>City</label>
                {errorText("city")}
              </div>
            </div>

            {/* ROLE */}
            <div className="relative">
              <select
                disabled={!isEditing}
                value={draft.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateField("role", e.target.value)
                }
                className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option className="text-black" value="student">
                  student
                </option>
                <option className="text-black" value="researcher">
                  researcher
                </option>
                <option className="text-black" value="faculty">
                  faculty
                </option>
                <option className="text-black" value="industry">
                  industry
                </option>
                <option className="text-black" value="other">
                  other
                </option>
              </select>
              <label className={labelClass}>Role</label>
            </div>

            {/* BIO */}
            <div className="relative">
              <textarea
                disabled={!isEditing}
                value={draft.biography}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateField("biography", e.target.value)
                }
                placeholder="Biography"
                rows={4}
                aria-invalid={!!errors.biography}
                className={
                  "peer w-full p-6 pt-8 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed resize-none" +
                  (errors.biography
                    ? " border-red-300/60 focus:border-red-200"
                    : "")
                }
              />
              <label className={labelClass}>Biography</label>
              <div className="mt-2 flex items-center justify-between">
                <div>{errorText("biography")}</div>
                <p className="text-xs text-white/60">
                  {draft.biography.trim().length}/500
                </p>
              </div>
            </div>

            {/* Bottom hint */}
            {isEditing && Object.keys(errors).length > 0 && (
              <div className="rounded-xl border border-red-200/20 bg-red-500/10 p-4 text-white/80 text-sm">
                Please fix the highlighted fields to save.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
