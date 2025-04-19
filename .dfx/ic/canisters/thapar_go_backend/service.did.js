export const idlFactory = ({ IDL }) => {
  const Society = IDL.Record({
    'id' : IDL.Text,
    'members' : IDL.Nat,
    'name' : IDL.Text,
    'room' : IDL.Text,
    'description' : IDL.Text,
    'email' : IDL.Text,
    'establishedYear' : IDL.Nat,
    'logoUrl' : IDL.Text,
    'category' : IDL.Text,
    'facultyHead' : IDL.Text,
    'phoneNumber' : IDL.Text,
    'registrationLink' : IDL.Text,
    'registrationStatus' : IDL.Text,
  });
  const SocialMedia = IDL.Record({
    'linkedin' : IDL.Opt(IDL.Text),
    'instagram' : IDL.Opt(IDL.Text),
    'facebook' : IDL.Opt(IDL.Text),
  });
  const SocietyWithSocial = IDL.Record({
    'society' : Society,
    'socialMedia' : SocialMedia,
  });
  return IDL.Service({
    'addSociety' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Text],
        [],
      ),
    'getAllSocieties' : IDL.Func([], [IDL.Vec(SocietyWithSocial)], ['query']),
    'getSocietyById' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(SocietyWithSocial)],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
