/**
 * Frontend Local Activation Code Verification Library
 * Completely local algorithmic rule validation according to custom VIP key generation rules.
 */

// Sample working VIP Activation Codes conforming to the rule:
export const SAMPLE_VIP_CODES = [
  'ROULETTE-PRO-D36JT18',
  'ROULETTE-PRO-F56BB30',
  'ROULETTE-PRO-C28QK16',
  'ROULETTE-PRO-E47ZZ28',
];

const LETTER_TO_TENS: Record<string, number> = {
  A: 0, // 00-09
  B: 1, // 10-19
  C: 2, // 20-29
  D: 3, // 30-39
  E: 4, // 40-49
  F: 5, // 50-59
  G: 6, // 60-69
  H: 7, // 70-79
  I: 8, // 80-89
  J: 9, // 90-99
};

/**
 * Validates whether an activation code conforms to the custom VIP rule:
 * 1. Fixed Prefix: ROULETTE-PRO-
 * 2. 1 Letter (A-J) corresponding to tens digit (A=0, B=1, ... J=9)
 * 3. 2 Digits (tens digit must match the letter range)
 * 4. 2 Random uppercase letters (A-Z)
 * 5. Checksum ending digits = product of the two digits (tens * units)
 *
 * Example:
 * ROULETTE-PRO-D36JT18 -> D=3, digits=36 (tens=3 matches D), random=JT, product=3*6=18 -> VALID
 * ROULETTE-PRO-F56BB30 -> F=5, digits=56 (tens=5 matches F), random=BB, product=5*6=30 -> VALID
 */
export function validateLicenseRule(rawCode: string): boolean {
  if (!rawCode || typeof rawCode !== 'string') return false;

  const code = rawCode.trim().toUpperCase();

  const prefix = 'ROULETTE-PRO-';
  if (!code.startsWith(prefix)) {
    return false;
  }

  const payload = code.slice(prefix.length).trim();

  // Pattern: Letter (A-J) + 2 digits + 2 letters + 1-2 digits checksum
  const match = payload.match(/^([A-J])(\d{2})([A-Z]{2})(\d{1,2})$/);
  if (!match) {
    return false;
  }

  const [, letter, digitsStr, _midLetters, checksumStr] = match;

  const expectedTens = LETTER_TO_TENS[letter];
  if (expectedTens === undefined) return false;

  const tensDigit = parseInt(digitsStr[0], 10);
  const unitsDigit = parseInt(digitsStr[1], 10);

  // 1. Check if the tens digit matches the letter range
  if (tensDigit !== expectedTens) {
    return false;
  }

  // 2. Check if ending checksum equals the product of the two digits
  const expectedChecksum = tensDigit * unitsDigit;
  const actualChecksum = parseInt(checksumStr, 10);

  if (actualChecksum !== expectedChecksum) {
    return false;
  }

  return true;
}

/**
 * Synchronous local code activation logic
 */
export function verifyAndActivateCodeLocal(rawCode: string): { success: boolean; message: string } {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return {
      success: false,
      message: '激活码无效 (Please enter a valid activation code)',
    };
  }

  const isValid = validateLicenseRule(code);

  if (!isValid) {
    return {
      success: false,
      message: '激活码无效 (Invalid activation code)',
    };
  }

  // Save VIP activation status locally permanently
  try {
    localStorage.setItem('isPro', 'true');
    localStorage.setItem('roulette_vip_isPro', 'true');
    localStorage.setItem('roulette_vip_activated_code', code);
    localStorage.setItem('roulette_vip_activated_time', new Date().toISOString());
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }

  return {
    success: true,
    message: '激活成功 (VIP Activated Successfully!)',
  };
}

/**
 * Check if VIP is activated from browser localStorage
 */
export function getIsVipActivated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isPro = localStorage.getItem('isPro');
    const vipPro = localStorage.getItem('roulette_vip_isPro');
    return isPro === 'true' || vipPro === 'true';
  } catch (e) {
    return false;
  }
}
