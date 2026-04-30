# CDN Manager — Design Spec
**Date:** 2026-04-30  
**Status:** Approved

---

## Overview

A CDN Manager page in the Bisatim dashboard that provides a central media library backed by **Supabase Storage**. All images uploaded through it are automatically compressed to WebP on the server using **Sharp**. It also audits the database for hardcoded external URLs (e.g. Unsplash links) and lets the admin clear them in bulk.

---

## Goals

1. Upload images to Supabase Storage from the dashboard.
2. Auto-compress every uploaded image server-side (Sharp → WebP, quality 80, max 1920px wide).
3. Display a gallery of all uploaded images with Copy URL and Delete actions.
4. Detect and bulk-clear hardcoded external URLs found in `site_images`, `categories`, `products.images[]`, and `blog.image`.
5. Filter the gallery by section via tabs (All, Site Images, Products, Blog, Categories).

---

## Non-Goals

- No auto-migration of external URLs to storage (user uploads fresh images manually).
- No image editing (crop, rotate, etc.).
- No per-image permission controls.

---

## Storage Layout

**Supabase Storage bucket:** `media` (public)

```
media/
  site/         ← site image slots
  products/     ← product images
  blog/         ← blog post covers
  categories/   ← category thumbnails
```

Files are stored as `{folder}/{slug}.webp`. The folder prefix is used to tag and filter images in the gallery tabs.

---

## Architecture

### Page: `src/app/dashboard/cdn/page.tsx` (Server Component)

On load:
1. Lists all files from Supabase Storage `media` bucket using `adminClient.storage.from('media').list()` per folder.
2. Runs an audit query across `site_images`, `categories`, `products`, and `blog` tables, counting URLs that do **not** start with `process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/media'`.
3. Passes storage listing and audit count as props to `UploadForm` client component.

### Server Actions: `src/app/dashboard/cdn/actions.ts`

**`uploadImage(fd: FormData)`**
- Receives `file: File` and `folder: string` from FormData.
- Reads file buffer, passes to Sharp: `sharp(buffer).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 })`.
- Generates slug from original filename: lowercase, spaces and special chars replaced with hyphens, `.webp` extension appended.
- Uploads compressed buffer to `media/{folder}/{slug}.webp` via `adminClient.storage.from('media').upload(...)`.
- Calls `revalidatePath('/dashboard/cdn')`.

**`deleteImage(path: string)`**
- Removes `path` from the `media` bucket via `adminClient.storage.from('media').remove([path])`.
- Calls `revalidatePath('/dashboard/cdn')`.

**`clearHardcodedUrls()`**
- Scans and nulls/empties hardcoded external URLs:
  - `site_images`: sets `url = null` where URL does not start with Supabase storage base.
  - `categories`: sets `image_url = null` where it does not start with Supabase storage base.
  - `products`: rebuilds `images` array removing non-storage URLs.
  - `blog`: sets `image = null` where it does not start with Supabase storage base.
- Calls `revalidatePath('/dashboard/cdn')` and revalidates affected sections.

### Client Component: `src/app/dashboard/cdn/UploadForm.tsx` (`'use client'`)

Receives the full storage listing and audit data as props from `page.tsx` and renders the entire interactive UI:
- `<input type="file" multiple accept="image/*">` — hidden, triggers `<form>` submission on change.
- Drag-and-drop zone — sets file on the hidden input and submits.
- Active tab state (All / Site Images / Products / Blog / Categories) — filters the image card grid client-side from the prop list.
- Upload folder selector (dropdown, default "products").
- Image card grid — each card's "Copy URL" button uses `navigator.clipboard.writeText()` (requires client context).
- Delete button on each card submits `deleteImage` Server Action via a `<form>`.
- All data mutations delegated to Server Actions.

---

## UI Layout

### Header
- Title "CDN Manager", subtitle showing file count and total size.
- "Upload images" button (triggers file input).

### Audit Banner (conditional)
- Shown only when `auditCount > 0`.
- Displays: `⚠ {n} hardcoded external URLs detected` with breakdown by table.
- "Clear all external links" button → calls `clearHardcodedUrls` Server Action.

### Tabs
All · Site Images · Products · Blog · Categories — filters the grid client-side.

### Drop Zone
Static hint bar: "Drop images here or use the Upload button — all files compressed to WebP automatically."

### Image Grid (4 columns)
Each card shows:
- Image preview (via Next.js `<Image unoptimized>`)
- Filename, compressed file size, dimensions
- Section badge (colour-coded: green = site, indigo = product, etc.)
- "Copy URL" button (copies public Supabase Storage URL to clipboard)
- Delete button (✕) → submits `deleteImage` Server Action

---

## Compression Settings

| Setting | Value |
|---|---|
| Output format | WebP |
| Quality | 80 |
| Max width | 1920px (downscale only) |
| Library | `sharp` |

---

## Sidebar Nav Entry

Add to `src/components/Sidebar.tsx`:
```tsx
{ href: '/dashboard/cdn', label: 'CDN Manager', icon: Cloud }
```

---

## Dependencies

- `sharp` — npm package, server-side only, added to `dependencies`.
- No new Supabase tables required.
- Requires creating the `media` public bucket in Supabase Storage (manual step or via migration).

---

## Error Handling

- Upload fails → Server Action throws, Next.js surfaces error to user (consistent with existing pattern).
- Delete fails → same.
- Storage bucket does not exist → clear error message in the page.

---

## Open Questions / Assumptions

- The `media` bucket will be created manually in the Supabase dashboard before first use.
- Filename collisions: if a file with the same slug already exists, the upload overwrites it (`upsert: true`).
- No pagination on the gallery for now (assumed manageable number of files).
