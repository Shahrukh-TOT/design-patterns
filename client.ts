import { Server } from ".";

export class Client {
    store: ClientDataStore = {
        timestamp: 0,
        items: {},
        changed: {}
    };

    constructor(
        public server: Server
    ) { }

    synchronize(): void {
        let store = this.store;
        let clientItems = store.items;
        let clientChanges = {}
        let changedTimes = store.changed;


        for (const id of Object.keys(changedTimes)) {
            clientChanges[id] = {
                lastModifiedTime: changedTimes[id],
                value: clientItems[id].value
            }
        }

        let response = this.server.synchronize({
            timestamp: store.timestamp,
            clientTime: Date.now(),
            changes: clientChanges
        });

        let serverChanges = response.changes;

        for (let id of Object.keys(serverChanges)) {
            clientItems[id] = {
                id,
                value: serverChanges[id]
            };
        }

        store.timestamp = response.timestamp;
        store.changed = {};
    }

    update(id: string, value: string): void {
        let store = this.store;
        store.items[id] = {
            id,
            value
        }

        store.changed[id] = Date.now();
    }

}


export interface ClientDataItem<T> {
    id: string;
    value: T;
}

export interface ClientDataStore {
    timestamp: number;
    items: {
        [id: string]: ClientDataItem<number | string>
    }

    changed: {
        [id: string]: number
    }
}