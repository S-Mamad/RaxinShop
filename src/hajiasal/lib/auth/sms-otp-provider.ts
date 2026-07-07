import type { OtpProvider, OtpSendResult } from "./otp-provider";

export class SmsOtpProvider implements OtpProvider {
  readonly name = "sms";

  canSendTo(_phone: string): boolean {
    return Boolean(process.env.SMS_API_KEY && process.env.SMS_SENDER);
  }

  async send(phone: string, code: string): Promise<OtpSendResult> {
    if (!this.canSendTo(phone)) {
      return {
        success: false,
        message:
          "سرویس پیامک هنوز فعال نیست. از شماره تست یا با پشتیبانی تماس بگیرید.",
      };
    }

    // Future: Kavenegar / Ghasedak / Melipayamak integration
    // const apiKey = process.env.SMS_API_KEY;
    // await fetch(...)

    void code;
    return {
      success: false,
      message: "ارسال پیامک در حال راه‌اندازی است",
    };
  }
}
