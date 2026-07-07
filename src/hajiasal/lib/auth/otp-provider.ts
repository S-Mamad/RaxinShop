export interface OtpSendResult {
  success: boolean;
  message: string;
}

export interface OtpVerifyResult {
  valid: boolean;
  message: string;
}

export interface OtpProvider {
  readonly name: string;
  send(phone: string, code: string): Promise<OtpSendResult>;
  canSendTo(phone: string): boolean;
}
