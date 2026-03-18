import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            padding: "8px 20px",
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
            2-minute assessment • $19
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: "800",
              color: "white",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Voice AI Scorecard
          </span>
          <span
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.85)",
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Is your business ready for an AI voice agent?
          </span>
        </div>

        {/* Score pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["Call Volume", "Tech Stack", "Process", "ROI Potential"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "600",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "20px",
          }}
        >
          talkra.ai
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
