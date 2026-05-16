export type AuthErrorMapping =
  | { kind: 'message'; text: string }
  | { kind: 'silent' };

export function mapAuthError(err: unknown): AuthErrorMapping {
  const code = readErrorCode(err);

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return { kind: 'silent' };

    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return { kind: 'message', text: 'Niepoprawny email lub hasło' };

    case 'auth/email-already-in-use':
      return { kind: 'message', text: 'Ten email jest już zarejestrowany' };

    case 'auth/weak-password':
      return { kind: 'message', text: 'Hasło zbyt słabe (min. 6 znaków)' };

    case 'auth/invalid-email':
      return { kind: 'message', text: 'Nieprawidłowy adres email' };

    case 'auth/missing-password':
      return { kind: 'message', text: 'Wpisz hasło' };

    case 'auth/missing-email':
      return { kind: 'message', text: 'Wpisz adres email' };

    case 'auth/too-many-requests':
      return { kind: 'message', text: 'Zbyt wiele prób, spróbuj później' };

    case 'auth/network-request-failed':
      return { kind: 'message', text: 'Brak połączenia z serwerem' };

    case 'auth/popup-blocked':
      return { kind: 'message', text: 'Przeglądarka zablokowała wyskakujące okno' };

    case 'auth/account-exists-with-different-credential':
      return {
        kind: 'message',
        text: 'Konto z tym emailem istnieje, zaloguj się inną metodą',
      };

    default:
      return { kind: 'message', text: 'Wystąpił błąd, spróbuj ponownie' };
  }
}

function readErrorCode(err: unknown): string {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const candidate =
      (err as { code?: unknown }).code ??
      (err as { message?: unknown }).message;
    return typeof candidate === 'string' ? candidate : '';
  }
  return '';
}
