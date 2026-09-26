import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { mediaUrl } from "./media";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Share image for a page: the page's photograph with the ink scrim, the
 * wordmark wave, and the title in Jost capitals. No prices, ever.
 */
export async function renderOg({
  title,
  eyebrow,
  image = "hero-le-morne",
}: {
  title: string;
  eyebrow?: string;
  image?: string;
}) {
  const [font, photo] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/og/Jost-Regular.ttf")),
    sharp(path.join(process.cwd(), "public", mediaUrl(image).src))
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
      .jpeg({ quality: 78 })
      .toBuffer(),
  ]);
  const bg = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Jost" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(100deg, rgba(6,13,34,0.9) 0%, rgba(6,13,34,0.72) 48%, rgba(6,13,34,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            color: "#F4EFE6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 40, letterSpacing: 8, color: "#9BD9F7" }}>AQUASAIL</div>
            <div style={{ width: 150, height: 4, borderRadius: 4, backgroundImage: "linear-gradient(90deg, #00ADEF, #2C3792)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
            {eyebrow ? (
              <div style={{ fontSize: 22, letterSpacing: 6, color: "#9BD9F7", textTransform: "uppercase" }}>{eyebrow}</div>
            ) : null}
            <div style={{ fontSize: title.length > 28 ? 64 : 80, lineHeight: 1.05, letterSpacing: 6, textTransform: "uppercase" }}>
              {title}
            </div>
            <div style={{ fontSize: 24, letterSpacing: 3, color: "rgba(244,239,230,.8)" }}>
              Watersports in Mauritius · Replies within one working day
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Jost", data: font, style: "normal", weight: 400 }] },
  );
}
