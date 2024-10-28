import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Appointment {
  'id' : string,
  'date' : string,
  'name' : string,
  'time' : string,
  'email' : string,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<Appointment> } |
  { 'err' : string };
export interface _SERVICE {
  'createAppointment' : ActorMethod<[string, string, string, string], Result>,
  'getAllAppointments' : ActorMethod<[], Result_1>,
  'getAppointment' : ActorMethod<[string], [] | [Appointment]>,
  'getAvailableSlots' : ActorMethod<[string], Array<string>>,
  'isAdmin' : ActorMethod<[], boolean>,
  'setAdmin' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
