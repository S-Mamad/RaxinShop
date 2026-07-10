import { TestOtpProvider } from "./test-otp-provider";
import { SmsOtpProvider } from "./sms-otp-provider";
import type { OtpProvider } from "./otp-provider";

const testProvider = new TestOtpProvider();
const smsProvider = new SmsOtpProvider();

/** Test OTP only in non-production, or when AUTH_ALLOW_TEST_OTP=true explicitly. */
export function isTestOtpAllowed(): boolean {
  if (process.env.AUTH_ALLOW_TEST_OTP === "true") return true;
  if (process.env.AUTH_ALLOW_TEST_OTP === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function getOtpProviderForPhone(phone: string): OtpProvider {
  if (isTestOtpAllowed() && testProvider.canSendTo(phone)) {
    return testProvider;
  }
  return smsProvider;
}

export function getTestOtpProvider(): TestOtpProvider {
  return testProvider;
}
