import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
  appName?: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  name = "there",
  appName = "AppName",
  dashboardUrl = "https://yourapp.com/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {appName}!</Heading>
          <Text style={text}>
            Hi {name}, we&apos;re excited to have you on board. Your account is
            ready to go.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={dashboardUrl}>
              Go to Dashboard
            </Link>
          </Section>
          <Text style={footer}>
            If you didn&apos;t create this account, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "480px",
};
const h1 = { color: "#333", fontSize: "24px" };
const text = { color: "#555", fontSize: "16px", lineHeight: "24px" };
const buttonContainer = { textAlign: "center" as const, marginTop: "24px" };
const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 24px",
  textDecoration: "none",
};
const footer = { color: "#999", fontSize: "12px", marginTop: "32px" };
