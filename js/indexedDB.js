const date = new Date(year, Number(localStorage.getItem("storedMonth")));
const DB_NAME = "NarvaroDB";
let STORE_NAME = `${date.toLocaleString("sv-SE", { month: "long" })} ${localStorage.getItem("storedYear")}`;

function checkVersion() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = () => {
      const db = request.result;
      resolve(db.version + 1);
    };
    request.onerror = () => reject(request.error);
  });
};

async function openDB(makeDB = false) {
  const currentVersion = await checkVersion();
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, currentVersion);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (makeDB) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "name"
          });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveData(dataArray) {
  const db = await openDB(true);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  dataArray.forEach(item => {
    // Handle the group object (no "name")
    if (!item.name && item.name_Group) {
      store.put({
        name: "name_Group",
        name_Group: item.name_Group
      });
    } else {
      store.put(item);
    }
  });

  return tx.complete;
}

async function getAllNarvaroDBNames() {
  const db = await openDB(false);
  let names = [];
  for (let i = 0; i < db.objectStoreNames.length; i++) {
    names.push(db.objectStoreNames[i]);
  }
  return names;
}

async function getAllNarvaro() {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < db.objectStoreNames.length; i++) {
      const tx = db.transaction(db.objectStoreNames[i], "readonly");
      const store = tx.objectStore(db.objectStoreNames[i]);
      const request = store.getAll();

      request.onsuccess = () => {
        const students = request.result;
        resolve(students);
      };

      request.onerror = (err) => {
        reject(err);
      };
    }
  });
}

async function getNarvaro(name) {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
      const tx = db.transaction(name, "readonly");
      const store = tx.objectStore(name);
      const request = store.getAll();

      request.onsuccess = () => {
        const students = request.result;
        resolve(students);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
}

async function removeDB() {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
    db.close();
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log("IndexedDB deleted");
      resolve(true);
    };

    request.onerror = () => {
      console.error("Failed to delete IndexedDB", request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn("Delete blocked: another tab or connection is open");
    };
  });
}
