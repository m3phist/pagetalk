// interfaces.ts
export type _EmailAddress = {
  id: string;
  emailAddress: string;
  linkedTo: any[];
};

export type _User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  banned: boolean;
  emailAddresses: _EmailAddress[];
};
