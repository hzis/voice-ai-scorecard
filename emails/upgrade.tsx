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

interface UpgradeEmailProps {
  name?: string;
  appName?: string;
  billingUrl?: string;
}

export default function UpgradeEmail({
  name = "there",
  appName = "AppName",
  billingUrl = "https://yourapp.com/billing",
}: UpgradeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re approaching your limit on {appName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Time to Upgrade?</Heading>
          <Text style={text}>
            Hi {name}, you&apos;re nearing your monthly usage limit. Upgrade to
            Pro for 100x more requests and premium features.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={billingUrl}>
              View Plans
            </Link>
          </Section>
          <Text style={footer}>
            {appName} &mdash; Ship your app faster.
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
