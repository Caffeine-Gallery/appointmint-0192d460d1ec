export const idlFactory = ({ IDL }) => {
  const Appointment = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Text,
    'name' : IDL.Text,
    'time' : IDL.Text,
    'email' : IDL.Text,
  });
  return IDL.Service({
    'createAppointment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'getAppointment' : IDL.Func([IDL.Text], [IDL.Opt(Appointment)], ['query']),
    'getAvailableSlots' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };