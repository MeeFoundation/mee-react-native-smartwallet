import { EventEmitter } from 'eventemitter3'

import { generateUUID } from './uuid'

const DUMMY_EVENT_NAME = 'event'

export abstract class BusEvent {
  readonly id: string
  readonly timestamp: number
  abstract readonly name: string

  constructor() {
    this.id = generateUUID()
    this.timestamp = Date.now()
  }
}

class EventBus {
  #emitter = new EventEmitter<typeof DUMMY_EVENT_NAME, BusEvent>()
  private static instance: EventBus

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus()
    return EventBus.instance
  }

  // biome-ignore lint/suspicious/noExplicitAny: any as it is any class constructor check
  subscribe<TEvent extends BusEvent>(eventClass: new (...args: any[]) => TEvent, callback: (event: TEvent) => void) {
    const fn = (event: unknown) => {
      if (event instanceof eventClass) callback(event)
    }

    this.#emitter.on(DUMMY_EVENT_NAME, fn)
    return () => this.#emitter.off(DUMMY_EVENT_NAME, fn)
  }

  emit<TEvent extends BusEvent>(event: TEvent): boolean {
    return this.#emitter.emit(DUMMY_EVENT_NAME, event)
  }
}

export const eventBus = EventBus.getInstance()
