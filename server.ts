export class Server {
    store: ServerDataStore = {
        items: {}
    }

    synchronize(request: SyncingRequest): SyncingResponse {
        let lastTimestamp = request.timestamp;
        let clientChanges = request.changes;
        let now = Date.now();
        let serverChanges = {};
        let items = this.store.items;

        let clientTimeOffset = now - request.clientTime;

        for (let id of Object.keys(clientChanges)) {
            let clientChange = clientChanges[id];

            let lastModifiedTime = Math.min(clientChange.lastModifiedTime + clientTimeOffset, now);

            if (Object.hasOwnProperty.call(items, id) && items[id].lastModifiedTime > clientChange.lastModifiedTime) {
                continue;
            }

            items[id] = {
                id,
                timestamp: now,
                lastModifiedTime,
                value: clientChange.value
            };
        }

        for (let id of Object.keys(items)) {
            let item = items[id];
            if (item.timestamp > lastTimestamp && item.timestamp !== now) {
                serverChanges[id] = item.value;
            }
        }

        return {
            timestamp: now,
            changes: serverChanges
        };
    }
}

export interface ServerDataItem<T> {
    id: string;
    timestamp: number;
    lastModifiedTime: number;
    value: T;
}

export interface ServerDataStore {
    items: {
        [id: string]: ServerDataItem<number | string>
    }
}

export interface SyncingRequest {
    timestamp: number;
    clientTime: number;
    changes: {
        [id: string]: ClientChange
    }
}

export interface SyncingResponse {
    timestamp: number;
    changes: {
        [id: string]: string;
    };
}

export interface ClientChange {
    lastModifiedTime: number;
    value: string;
}