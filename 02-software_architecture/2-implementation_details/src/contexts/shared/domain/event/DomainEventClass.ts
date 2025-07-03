import { DomainEvent } from "./DomainEvent";

export type DomainEventClass<T extends DomainEvent = DomainEvent> = {
  new (...args: any[]): T;
  eventName: string;
};
