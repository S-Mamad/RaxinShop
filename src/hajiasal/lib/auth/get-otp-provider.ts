import { TestOtpProvider } from "./test-otp-provider";
import { SmsOtpProvider } from "./sms-otp-provider";
import type { OtpProvider } from "./otp-provider";

const testProvider = new TestOtpProvider();
const smsProvider = new SmsOtpProvider();

export function getOtpProviderForPhone(phone: string): OtpProvider {
  if (testProvider.canSendTo(phone)) return testProvider;
  return smsProvider;
}

export function getTestOtpProvider(): TestOtpProvider {
  return testProvider;
}
