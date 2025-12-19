import Dexie, { type Table } from 'dexie';
import { GlucoseLog, UserProfile } from '../types';

export class GlockDatabase extends Dexie {
    logs!: Table<GlucoseLog>;
    profile!: Table<UserProfile>;

    constructor() {
        super('GlockTrackDB');
        this.version(1).stores({
            logs: '++id, type, timestamp, source',
            profile: '++id'
        });
    }
}

export const db = new GlockDatabase();
