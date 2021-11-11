export class Server {
    store: DataStore = {
        data: "",
        timestamp: 0
    }

    synchronize(clientDataStore: DataStore): DataSyncingInfo {
        if (clientDataStore.timestamp > this.store.timestamp) {
            this.store = clientDataStore;
            return undefined;
        } else if (clientDataStore.timestamp < this.store.timestamp) {
            return {
                data: this.store.data,
                timestamp: this.store.timestamp
            };
        } else {
            return undefined;
        }
    }
}

export interface DataStore {
    timestamp: number;
    data: string;
}

interface DataSyncingInfo {
    timestamp: number;
    data: string;
}

// Page 52: Making the relationships clear
