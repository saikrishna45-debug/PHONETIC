export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationDetails extends AuthCredentials {
  fullName: string;
}

export async function signInMock(credentials: AuthCredentials): Promise<void> {
  void credentials;
  await Promise.resolve();
}

export async function signUpMock(details: RegistrationDetails): Promise<void> {
  void details;
  await Promise.resolve();
}

export async function continueWithGoogleMock(): Promise<void> {
  await Promise.resolve();
}

export async function requestPasswordResetMock(email: string): Promise<void> {
  void email;
  await Promise.resolve();
}
