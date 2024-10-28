export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Appointment = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Text,
    'name' : IDL.Text,
    'time' : IDL.Text,
    'email' : IDL.Text,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(Appointment),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'createAppointment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'getAdmin' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getAllAppointments' : IDL.Func([], [Result_1], []),
    'getAppointment' : IDL.Func([IDL.Text], [IDL.Opt(Appointment)], ['query']),
    'getAvailableSlots' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'setAdmin' : IDL.Func([], [Result], []),
    'setSpecificAdmin' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
