const DB_Name_Month = currentDate.toLocaleString('sv-SE', { month: 'long' });
const DB_Name_Year = currentDate.toLocaleString('sv-SE', { year: 'numeric' });
const DB_NAME = "NarvaroDB";

let DB_VERSION = 0;
let STORE_NAME = `${DB_Name_Month} ${DB_Name_Year}`;

checkVersion();
function checkVersion() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = () => {
      const db = request.result;
      DB_VERSION = db.version + 1;
      resolve(DB_VERSION);
    };
    request.onerror = () => reject(request.error);
  });
};

function openDB(makeDB = false) {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (makeDB) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "name", // use "name" as primary key
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
  console.log(db.objectStoreNames)
  for (let i = 0; i < db.objectStoreNames.length; i++) {
    console.log(db.objectStoreNames[i]);
    names.push(db.objectStoreNames[i]);
  }
  return names;
}

async function getAllNarvaro() {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < db.objectStoreNames.length; i++) {

      console.log(`Getting all students from store: ${db.objectStoreNames[i]}`);
      const tx = db.transaction(db.objectStoreNames[i], "readonly");
      const store = tx.objectStore(db.objectStoreNames[i]);
      const request = store.getAll();

      request.onsuccess = () => {
        const students = request.result;
        console.log('Got all the students');
        console.table(students);
        resolve(students);
      };

      request.onerror = (err) => {
        console.error(`Error to get all students: ${err}`);
        reject(err);
      };
    }
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
