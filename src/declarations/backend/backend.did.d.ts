import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Appointment {
  'id' : string,
  'date' : string,
  'name' : string,
  'time' : string,
  'email' : string,
  'phoneNumber' : string,
}
export interface DayAvailability {
  'startTime' : string,
  'endTime' : string,
  'isAvailable' : boolean,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<string> } |
  { 'err' : string };
export type Result_2 = { 'ok' : Array<Appointment> } |
  { 'err' : string };
export interface _SERVICE {
  'createAppointment' : ActorMethod<
    [string, string, string, string, string],
    Result
  >,
  'getAdmin' : ActorMethod<[], [] | [Principal]>,
  'getAllAppointments' : ActorMethod<[], Result_2>,
  'getAppointment' : ActorMethod<[string], [] | [Appointment]>,
  'getAvailableSlots' : ActorMethod<[string], Result_1>,
  'getDayAvailability' : ActorMethod<[string], [] | [DayAvailability]>,
  'isAdmin' : ActorMethod<[], boolean>,
  'setAdmin' : ActorMethod<[], Result>,
  'setDayAvailability' : ActorMethod<[string, boolean, string, string], Result>,
  'setSpecificAdmin' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
