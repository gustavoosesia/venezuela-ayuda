import { ImageResponse } from "next/og";

export const alt = "Venezuela Se Levanta — Red de Voluntarios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#b91c1c",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: 999,
            padding: "12px 32px",
            fontSize: 28,
            marginBottom: 40,
          }}
        >
          ❤️ Respuesta gratuita al terremoto en Venezuela
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 900, lineHeight: 1.1 }}>
          Venezuela Se Levanta
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 28, color: "#fecaca" }}>
          Voluntarios profesionales de todo el mundo, 100% gratis
        </div>
      </div>
    ),
    { ...size }
  );
}
