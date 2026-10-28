# Assets

## Where files go

```
assets/projects/<project-id>/01.jpg, 02.jpg, ...
```

The `<project-id>` must match the key in `projectData` in `script.js`
(e.g. `monmouth-retreat`). Numbering the files in display order keeps the
list in `projectData` easy to read against the folder.

## Adding a project — the whole checklist

1. Drop the images in `assets/projects/<id>/`
2. Add one object to `projectData` in `script.js`
3. Add its translated strings to `i18n.js` (`proj.<id>.desc` / `.type` / `.role`)

The card in the gallery is generated from `projectData` — there is no card
markup to write in `index.html`.

## Export specs

These match what the CSS already expects, so images fill their frames
without distortion:

Export at **2x the size the image actually displays at** — these are the
display sizes measured at a 1440px viewport, doubled for retina:

| Where | Aspect | Displays at | Export width |
|---|---|---|---|
| Gallery card (`thumb`) | 4:3 | 717px | ~1400px |
| Detail hero (`single` / `mixed`) | 16:9 | 956px | ~1900px |
| Detail tile (`mixed`) | 1:1 square | 311px | ~700px |
| Detail, `gallery` layout | 4:3 | ~470px | ~950px |
| Detail, `masonry` layout | mixed, cropped by CSS | ~500px | ~1200px |
| `full` (click-to-zoom) | native, uncropped | up to 82vh | ~2000px |

The detail tiles are **square**, and deliberately so: they hold a mix of
portrait and landscape photos, and `object-fit: cover` in a square frame
crops both far more gently than a landscape frame would crop a portrait
photo. Don't widen them without checking a portrait shot first.

Tiles are small on purpose — they're navigation. Click-to-zoom is where the
work actually gets looked at, which is what the `full` version is for.

- **Photos** → JPEG, quality ~80.
- **Flat-colour graphics** → SVG if you have vector, otherwise PNG.
- Anything wider than ~1800px is wasted bytes on a portfolio site.
- Images are lazy-loaded and given explicit `width`/`height` so they don't
  shift the layout while loading — pass the real pixel dimensions as `w`/`h`
  so that works.

## Alt text

Alt text is content, so it lives in `i18n.js` and gets translated like
everything else. Per image, the key is:

```
proj.<id>.alt.<n>     // n is 1-based, matching the image order
```

If a key is missing the site falls back to a generated "Photo N from
<title>" string, which is *better than nothing but worse than real alt
text* — a screen reader user gets told an image exists but not what's in
it. Fill these in for anything where the image content carries meaning.

Purely decorative artwork should set `alt: ''` explicitly on the entry.

## Video

```js
video: {
  src: 'assets/projects/<id>/film.mp4',
  poster: 'assets/projects/<id>/poster.jpg',
  captions: 'assets/projects/<id>/captions.vtt'   // strongly recommended
}
```

`captions` is a WebVTT file. Video with meaningful audio needs captions to
meet WCAG 1.2.2 — if the piece is silent or music-only, say so in the
project description instead.

### Export spec

Commit a **web export, never the master.** A finishing render is sized for
archival, not for someone on a phone:

| | Bitrate | 26s clip |
|---|---|---|
| Master export | ~20 Mbps | 67 MB |
| Web export | **3–4 Mbps** | 10–14 MB |

Both are 1920×1080 H.264 — the web copy is not smaller on screen, it just
stops spending bits nobody can see at this size. Keep the full resolution
and drop the bitrate; downscaling to 720p is the wrong lever and costs
visible sharpness.

The player sets `preload="metadata"`, so the file isn't downloaded until
someone presses play — only a few KB of header is fetched to draw the
controls. That makes a mid-size mp4 survivable, but it doesn't make a
master-quality one acceptable.

If the film runs longer than a minute or two, host it on YouTube/Vimeo and
link out from the description rather than committing the mp4 here.

## Gotcha: rotating with `sips` double-rotates in the browser

`sips -r 90` bakes the rotation into the pixels **and** writes an EXIF
orientation tag. Browsers then apply the tag on top of the already-rotated
pixels, so the image lands back where it started — while `sips -g` keeps
reporting the stored (correct-looking) dimensions, so the problem is
invisible from the command line.

Symptom: `sips` says `900x1200` but the browser reports `naturalWidth`
`1200x900`.

After any `sips -r`, reset the orientation tag to `1`:

```
python3 -c "
import struct,sys
p=sys.argv[1]; d=bytearray(open(p,'rb').read())
k=d.find(b'Exif\x00\x00'); t0=k+6
en='<' if d[t0:t0+2]==b'II' else '>'
off=struct.unpack_from(en+'I',d,t0+4)[0]
for j in range(struct.unpack_from(en+'H',d,t0+off)[0]):
    e=t0+off+2+j*12
    if struct.unpack_from(en+'H',d,e)[0]==0x0112:
        struct.pack_into(en+'H',d,e+8,1); break
open(p,'wb').write(bytes(d))" FILE.jpg
```

## Gotcha: `--cropOffset` is in STORED pixels, not displayed ones

Phone photos are often stored landscape with an EXIF orientation tag that
rotates them for display. `sips` crops the **stored** raster, but the viewer
(and the Read tool, and the browser) shows you the **rotated** one — so the
width and height you see are swapped relative to the ones your crop uses.

Symptom: a black bar along one edge of the output. The crop ran off the end
of the stored raster, sips padded it, and the rotation moved the padding to
an edge that looks unrelated to the offset you typed.

Check orientation before cropping anything from a phone:

```
sips -g pixelWidth -g pixelHeight -g orientation FILE.jpg
```

For orientation 6 (rotate 90° CW to display), with stored size W×H:

```
stored_x = displayed_y
stored_y = H - displayed_x
```

So a square crop of the displayed portrait is a full-height crop of the
stored landscape, offset along stored **x**:
`sips -c <side> <side> --cropOffset <stored_y> <stored_x>`.

Orientation 1 needs none of this — displayed and stored agree.

**Or skip the math entirely.** `scratchpad/upcrop.swift` loads the file through
CoreGraphics with the orientation already applied, crops in the coordinates you
actually see, and writes the result tagged orientation 1:

```
upcrop in.jpg out.jpg [x y w h] [maxDim]
```

That is how the `sandcastles` tiles were cut. It also sidesteps the `sips -r`
double-rotation gotcha above, since nothing downstream has a tag left to apply.

Always sanity-check a rotated image's `naturalWidth`/`naturalHeight` in the
browser against the `w`/`h` you put in `projectData` — a mismatch there is
also what causes layout shift as the image loads.


## Click-to-zoom

Any image entry with a `full` path becomes clickable, opening in a lightbox:

```js
{ src: '.../03-banner.jpg', w: 1200, h: 900,
  full: '.../03-banner-full.jpg' }
```

Without `full` the image isn't zoomable — deliberately, since opening the
same resolution at a larger size is just a bigger blur. The lightbox reuses
the thumbnail's alt text as its caption, so it follows the language
automatically and there's nothing extra to translate.
