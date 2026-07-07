import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "راکسین‌شاپ | استودیو توسعه";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#08080c",
          color: "#ececf1",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#2dd4bf",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          raxinshop · v3.0
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          محصول دیجیتال که فردا هم scale شود.
        </div>
        <div style={{ fontSize: 32, color: "#8b8b9a", marginTop: 24 }}>
          از MVP تا production · تهران
        </div>
      </div>
    ),
    { ...size },
  );
}
