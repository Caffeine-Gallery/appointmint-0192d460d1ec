export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Appointment = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Text,
    'name' : IDL.Text,
    'time' : IDL.Text,
    'email' : IDL.Text,
    'phoneNumber' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Vec(Appointment),
    'err' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const DayAvailability = IDL.Record({
    'startTime' : IDL.Text,
    'endTime' : IDL.Text,
    'isAvailable' : IDL.Bool,
  });
  return IDL.Service({
    'createAppointment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'getAdmin' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getAllAppointments' : IDL.Func([], [Result_2], []),
    'getAppointment' : IDL.Func([IDL.Text], [IDL.Opt(Appointment)], ['query']),
    'getAvailableSlots' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getDayAvailability' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(DayAvailability)],
        ['query'],
      ),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'setAdmin' : IDL.Func([], [Result], []),
    'setDayAvailability' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'setSpecificAdmin' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
