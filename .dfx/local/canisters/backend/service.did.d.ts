import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface SocialMedia {
  'linkedin' : [] | [string],
  'instagram' : [] | [string],
  'facebook' : [] | [string],
}
export interface Society {
  'id' : string,
  'members' : bigint,
  'name' : string,
  'room' : string,
  'description' : string,
  'email' : string,
  'establishedYear' : bigint,
  'logoUrl' : string,
  'category' : string,
  'facultyHead' : string,
  'phoneNumber' : string,
  'registrationLink' : string,
  'registrationStatus' : string,
}
export interface SocietyWithSocial {
  'society' : Society,
  'socialMedia' : SocialMedia,
}
export interface _SERVICE {
  'addSociety' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      bigint,
      bigint,
      [] | [string],
      [] | [string],
      [] | [string],
    ],
    string
  >,
  'getAllSocieties' : ActorMethod<[], Array<SocietyWithSocial>>,
  'getSocietyById' : ActorMethod<[string], [] | [SocietyWithSocial]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
