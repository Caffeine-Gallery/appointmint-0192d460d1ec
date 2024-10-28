import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Appointment = {
    id: Text;
    date: Text;
    time: Text;
    name: Text;
    email: Text;
  };

  stable var appointmentEntries : [(Text, Appointment)] = [];
  let appointments = HashMap.fromIter<Text, Appointment>(appointmentEntries.vals(), 10, Text.equal, Text.hash);

  stable var adminPrincipal : ?Principal = null;

  public shared(msg) func setAdmin() : async Result.Result<Text, Text> {
    adminPrincipal := ?msg.caller;
    #ok("Admin set successfully")
  };

  public shared(msg) func setSpecificAdmin(newAdmin: Principal) : async Result.Result<Text, Text> {
    adminPrincipal := ?newAdmin;
    #ok("Admin set successfully to " # Principal.toText(newAdmin))
  };

  public query func getAdmin() : async ?Principal {
    adminPrincipal
  };

  public shared(msg) func createAppointment(date: Text, time: Text, name: Text, email: Text) : async Result.Result<Text, Text> {
    let id = Text.concat(date, time);
    let appointment : Appointment = {
      id;
      date;
      time;
      name;
      email;
    };
    appointments.put(id, appointment);
    #ok(id)
  };

  public query func getAppointment(id: Text) : async ?Appointment {
    appointments.get(id)
  };

  public query func getAvailableSlots(date: Text) : async [Text] {
    let allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    let bookedSlots = Array.mapFilter<(Text, Appointment), Text>(Iter.toArray(appointments.entries()), func((_, appointment)) {
      if (appointment.date == date) {
        ?appointment.time
      } else {
        null
      }
    });
    Array.filter<Text>(allSlots, func(slot) {
      Option.isNull(Array.find<Text>(bookedSlots, func(bookedSlot) { bookedSlot == slot }))
    })
  };

  public shared(msg) func getAllAppointments() : async Result.Result<[Appointment], Text> {
    switch (adminPrincipal) {
      case (null) { #err("Admin not set") };
      case (?admin) {
        if (Principal.equal(msg.caller, admin)) {
          #ok(Iter.toArray(appointments.vals()))
        } else {
          #err("Unauthorized access")
        }
      };
    }
  };

  public query(msg) func isAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) { false };
      case (?admin) { Principal.equal(msg.caller, admin) };
    }
  };

  system func preupgrade() {
    appointmentEntries := Iter.toArray(appointments.entries());
  };

  system func postupgrade() {
    appointmentEntries := [];
  };
}
