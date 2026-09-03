import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#071A2B",
          borderRadius: 14,
          color: "#7FD7EA",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        EG
      </div>
    ),
    size,
  );
}
