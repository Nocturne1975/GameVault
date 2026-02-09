"use client";

import * as React from "react";
import {useRouter, useSearchParams} from "next/navigation";

import type {GameStatus, Platform} from "@/generated/prisma";
import { addGame } from "@/actions/games";

type FormState = {
    title: string; 
    platform: Platform | "";
    status: GameStatus;
    rating: "" | "1" | "2" | "3" | "4" | "5";
    imageUrl: string;
    isPublic: boolean;
};

type Errors = Partial<Record<keyof FormState, string>> & { form?: string};

const PLATFORMS: Platform[]= ["PC", "PS5", "XBOX", "SWITCH", "MOBILE", "AUTRE"];
const STATUSES: GameStatus[] = ["A_JOUER", "EN_COURS", "TERMINE", "ABANDONNE"];

function isValidUrl(value: string) {
    if (!value.trim()) return true;
    try {
        new URL(value);
        return true;        
    } catch {
        return false;
    }
}

export default function GameForm() {
    const router= useRouter();
    const searchParams = useSearchParams();

    // Bonus RAWG/ explore: pre=remplissage via query params
    const prefillTitle = searchParams.get("title") ?? "";
  const prefillImageUrl = searchParams.get("imageUrl") ?? "";

  const [state, setState] = React.useState<FormState>({
    title: prefillTitle,
    platform: "",
    status: "A_JOUER",
    rating: "",
    imageUrl: prefillImageUrl,
    isPublic: true,
  });

  const [errors, setErrors] = React.useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Si l'utilisateur arrive plus tard avec un autre query param, on synchronise (sans écraser s'il a déjà tapé)
  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      title: prev.title || prefillTitle,
      imageUrl: prev.imageUrl || prefillImageUrl,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillTitle, prefillImageUrl]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  }

  function validate(s: FormState): Errors {
    const next: Errors = {};

    if (!s.title.trim()) next.title = "Le titre est requis.";
    if (!s.platform) next.platform = "La plateforme est requise.";

    if (!isValidUrl(s.imageUrl)) next.imageUrl = "URL invalide (ex: https://...).";

    if (s.rating) {
      const ratingNum = Number(s.rating);
      if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        next.rating = "La note doit être entre 1 et 5.";
      }
    }

    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate(state);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await addGame({
        title: state.title.trim(),
        platform: state.platform as Platform,
        status: state.status,
        rating: state.rating ? Number(state.rating) : null,
        imageUrl: state.imageUrl.trim() ? state.imageUrl.trim() : null,
        isPublic: state.isPublic,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errors.form ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.form}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          value={state.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="Ex: Elden Ring"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="platform" className="text-sm font-medium">
            Plateforme
          </label>
          <select
            id="platform"
            value={state.platform}
            onChange={(e) => setField("platform", e.target.value as FormState["platform"])}
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choisir…</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.platform ? (
            <p className="text-sm text-red-600">{errors.platform}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <select
            id="status"
            value={state.status}
            onChange={(e) => setField("status", e.target.value as GameStatus)}
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="rating" className="text-sm font-medium">
            Note (1–5)
          </label>
          <select
            id="rating"
            value={state.rating}
            onChange={(e) => setField("rating", e.target.value as FormState["rating"])}
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Aucune</option>
            <option value="1">1 / 5</option>
            <option value="2">2 / 5</option>
            <option value="3">3 / 5</option>
            <option value="4">4 / 5</option>
            <option value="5">5 / 5</option>
          </select>
          {errors.rating ? <p className="text-sm text-red-600">{errors.rating}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            Image URL (optionnel)
          </label>
          <input
            id="imageUrl"
            value={state.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.imageUrl ? (
            <p className="text-sm text-red-600">{errors.imageUrl}</p>
          ) : null}
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={state.isPublic}
          onChange={(e) => setField("isPublic", e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm">Rendre ce jeu public</span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Ajout…" : "Ajouter"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border px-4 py-2 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}