import type { OtpProvider, OtpSendResult } from "./otp-provider";

type SmsProvider = "kavenegar" | "ghasedak";

function getProvider(): SmsProvider {
  const p = process.env.SMS_PROVIDER?.toLowerCase();
  return p === "ghasedak" ? "ghasedak" : "kavenegar";
}

async function sendViaKavenegar(
  phone: string,
  code: string,
): Promise<OtpSendResult> {
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER;
  if (!apiKey || !sender) {
    return {
      success: false,
      message: "سرویس پیامک پیکربندی نشده است",
    };
  }

  const receptor = phone.replace(/\D/g, "");
  const message = `کد تأیید حاجی عسل: ${code}`;
  const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;

  const body = new URLSearchParams({
    receptor,
    sender,
    message,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.return?.status !== 200) {
    return {
      success: false,
      message: "خطا در ارسال پیامک. لطفاً دوباره تلاش کنید",
    };
  }

  return { success: true, message: "کد تأیید ارسال شد" };
}

async function sendViaGhasedak(
  phone: string,
  code: string,
): Promise<OtpSendResult> {
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER;
  if (!apiKey || !sender) {
    return {
      success: false,
      message: "سرویس پیامک پیکربندی نشده است",
    };
  }

  const res = await fetch("https://api.ghasedak.me/v2/sms/send/simple", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      apikey: apiKey,
    },
    body: new URLSearchParams({
      message: `کد تأیید حاجی عسل: ${code}`,
      receptor: phone.replace(/\D/g, ""),
      linenumber: sender,
    }).toString(),
  });

  if (!res.ok) {
    return {
      success: false,
      message: "خطا در ارسال پیامک. لطفاً دوباره تلاش کنید",
    };
  }

  return { success: true, message: "کد تأیید ارسال شد" };
}

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
          "سرویس پیامک فعال نیست. از شماره تست در محیط توسعه استفاده کنید.",
      };
    }

    const provider = getProvider();
    if (provider === "ghasedak") {
      return sendViaGhasedak(phone, code);
    }
    return sendViaKavenegar(phone, code);
  }
}
