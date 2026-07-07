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
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#2dd4bf",
            marginBottom: 24,
          }}
        >
          raxinshop · v3.1
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          محصول دیجیتالی که فردا هم رشد کند.
        </div>
        <div style={{ fontSize: 28, color: "#8b8b9a", marginTop: 24 }}>
          از ایده تا اجرا · تهران
        </div>
      </div>
    ),
    { ...size },
  );
}
