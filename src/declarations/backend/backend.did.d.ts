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
export interface _SERVICE {
  'createAppointment' : ActorMethod<[string, string, string, string], string>,
  'getAppointment' : ActorMethod<[string], [] | [Appointment]>,
  'getAvailableSlots' : ActorMethod<[string], Array<string>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
