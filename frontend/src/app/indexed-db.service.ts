import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db!: IDBDatabase;

  constructor() {
    this.openDatabase();
  }

  openDatabase() {
    const request = indexedDB.open('myDatabase', 1);

    request.onerror = (event:any) => {
      console.error("Database error: " + event.target.errorCode);
    };

    request.onupgradeneeded = (event:any) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'id', autoIncrement: true });
      // Define the structure of your object store here
    };

    request.onsuccess = (event:any) => {
      this.db = event.target.result;
    };
  }

  addData(data: any) {
    const transaction = this.db.transaction(['myObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('myObjectStore');
    const request = objectStore.add(data);

    request.onsuccess = (event) => {
      console.log('Data added successfully');
    };

    request.onerror = (event:any) => {
      console.error('Error adding data: ', event.target.error);
    };
  }

  getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['myObjectStore'], 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve(request.result);
      };

      request.onerror = (event:any) => {
        reject(event.target.error);
      };
    });
  }
}
